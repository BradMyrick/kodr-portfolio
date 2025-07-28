/**
 * WebSocket-based RPC Client for communication with Cap'n Proto backend services
 */

export interface RPCMessage {
  id: string;
  method: string;
  params?: any;
  result?: any;
  error?: any;
}

export interface RPCCallOptions {
  timeout?: number;
}

export class RPCClient {
  private ws: WebSocket | null = null;
  private url: string;
  private pendingCalls: Map<string, { resolve: Function; reject: Function; timeout: number }> = new Map();
  private messageId: number = 0;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor(url?: string) {
    // Default to the correct backend RPC endpoint
    this.url = url || (typeof window !== 'undefined' 
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:8080/rpc`
      : 'ws://localhost:8080/rpc');
  }

  /**
   * Connect to the RPC server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('RPC connection established');
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve();
        };
        
        this.ws.onerror = (error) => {
          console.error('RPC connection error:', error);
          if (!this.connected) {
            reject(error);
          }
        };
        
        this.ws.onclose = () => {
          console.log('RPC connection closed');
          this.connected = false;
          this.handleDisconnect();
        };
        
        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: string): void {
    try {
      const message: RPCMessage = JSON.parse(data);
      
      if (message.id && this.pendingCalls.has(message.id)) {
        const { resolve, reject, timeout } = this.pendingCalls.get(message.id)!;
        window.clearTimeout(timeout);
        this.pendingCalls.delete(message.id);
        
        if (message.error) {
          reject(new Error(message.error));
        } else {
          resolve(message.result);
        }
      }
    } catch (error) {
      console.error('Failed to handle RPC message:', error);
    }
  }

  /**
   * Handle disconnection and attempt reconnection
   */
  private handleDisconnect(): void {
    // Clear all pending calls
    for (const [id, { reject, timeout }] of this.pendingCalls) {
      window.clearTimeout(timeout);
      reject(new Error('Connection lost'));
    }
    this.pendingCalls.clear();
    
    // Attempt reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  /**
   * Call a remote procedure
   */
  async call<T = any>(method: string, params?: any, options: RPCCallOptions = {}): Promise<T> {
    if (!this.connected || !this.ws) {
      throw new Error('Not connected to RPC server');
    }
    
    const id = `${++this.messageId}`;
    const timeout = options.timeout || 30000; // 30 seconds default
    
    return new Promise((resolve, reject) => {
      const timeoutHandle = window.setTimeout(() => {
        this.pendingCalls.delete(id);
        reject(new Error(`RPC call timed out: ${method}`));
      }, timeout);
      
      this.pendingCalls.set(id, { resolve, reject, timeout: timeoutHandle });
      
      const message: RPCMessage = {
        id,
        method,
        params
      };
      
      try {
        this.ws!.send(JSON.stringify(message));
      } catch (error) {
        this.pendingCalls.delete(id);
        window.clearTimeout(timeoutHandle);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the RPC server
   */
  disconnect(): void {
    this.connected = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

// Service interfaces
export interface AuthService {
  login(email: string, password: string): Promise<{ token: string; refreshToken: string; user: any }>;
  logout(accessToken: string, refreshToken: string): Promise<{ success: boolean }>;
  refresh(refreshToken: string): Promise<{ token: string; refreshToken: string; expiresIn: number; tokenType: string }>;
}

export interface UserService {
  getUser(userId: string, token: string): Promise<any>;
  updateProfile(userId: string, token: string, updates: any): Promise<any>;
}

export interface ProjectService {
  createProject(project: any, token: string): Promise<any>;
  getProject(projectId: string, token: string): Promise<any>;
  updateProject(projectId: string, updates: any, token: string): Promise<any>;
  deleteProject(projectId: string, token: string): Promise<boolean>;
}

// Service wrappers
export class RPCServices {
  private client: RPCClient;
  
  constructor(client: RPCClient) {
    this.client = client;
  }
  
  get auth(): AuthService {
    return {
      login: (email: string, password: string) => 
        this.client.call('auth.login', { email, password }),
      logout: (accessToken: string, refreshToken: string) => 
        this.client.call('auth.logout', { accessToken, refreshToken }),
      refresh: (refreshToken: string) => 
        this.client.call('auth.refresh', { refreshToken })
    };
  }
  
  get user(): UserService {
    return {
      getUser: (userId: string, token: string) => 
        this.client.call('user.getUser', { userId, token }),
      updateProfile: (userId: string, token: string, updates: any) => 
        this.client.call('user.updateProfile', { userId, token, updates })
    };
  }
  
  get project(): ProjectService {
    return {
      createProject: (project: any, token: string) => 
        this.client.call('project.createProject', { project, token }),
      getProject: (projectId: string, token: string) => 
        this.client.call('project.getProject', { projectId, token }),
      updateProject: (projectId: string, updates: any, token: string) => 
        this.client.call('project.updateProject', { projectId, updates, token }),
      deleteProject: (projectId: string, token: string) => 
        this.client.call('project.deleteProject', { projectId, token })
    };
  }
}

// Singleton instance
let rpcClientInstance: RPCClient | null = null;
let rpcServicesInstance: RPCServices | null = null;

/**
 * Get or create the RPC client singleton
 */
export function getRPCClient(): RPCClient {
  if (!rpcClientInstance) {
    rpcClientInstance = new RPCClient();
  }
  return rpcClientInstance;
}

/**
 * Get or create the RPC services singleton
 */
export function getRPCServices(): RPCServices {
  if (!rpcServicesInstance) {
    rpcServicesInstance = new RPCServices(getRPCClient());
  }
  return rpcServicesInstance;
}
