import { RPCClient, RPCServices, getRPCClient, getRPCServices } from '../client';

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number = 0; // CONNECTING
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url: string) {
    this.url = url;
    // Simulate async connection
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 0);
  }

  send(data: string): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    // For testing, echo back the message with a result
    const request = JSON.parse(data);
    const response = {
      id: request.id,
      result: { success: true, echo: request.params }
    };
    
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data: JSON.stringify(response) }));
      }
    }, 0);
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// Replace global WebSocket with mock
(global as any).WebSocket = MockWebSocket;

describe('RPCClient', () => {
  let client: RPCClient;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton instances
    (getRPCClient as any).rpcClientInstance = null;
    (getRPCServices as any).rpcServicesInstance = null;
  });

  afterEach(() => {
    if (client && client.isConnected()) {
      client.disconnect();
    }
  });

  describe('Connection', () => {
    it('should connect successfully', async () => {
      client = new RPCClient('ws://localhost:8081/rpc');
      await client.connect();
      expect(client.isConnected()).toBe(true);
    });

    it('should handle connection with default URL', async () => {
      client = new RPCClient();
      await client.connect();
      expect(client.isConnected()).toBe(true);
    });

    it('should disconnect properly', async () => {
      client = new RPCClient();
      await client.connect();
      expect(client.isConnected()).toBe(true);
      
      client.disconnect();
      expect(client.isConnected()).toBe(false);
    });
  });

  describe('RPC Calls', () => {
    beforeEach(async () => {
      client = new RPCClient();
      await client.connect();
    });

    it('should make successful RPC call', async () => {
      const result = await client.call('test.method', { foo: 'bar' });
      expect(result).toEqual({ success: true, echo: { foo: 'bar' } });
    });

    it('should handle RPC call without params', async () => {
      const result = await client.call('test.noparams');
      expect(result).toEqual({ success: true, echo: undefined });
    });

    it('should throw error when not connected', async () => {
      client.disconnect();
      await expect(client.call('test.method', {})).rejects.toThrow('Not connected to RPC server');
    });

    it('should handle multiple concurrent calls', async () => {
      const promises = [
        client.call('test.method1', { id: 1 }),
        client.call('test.method2', { id: 2 }),
        client.call('test.method3', { id: 3 })
      ];

      const results = await Promise.all(promises);
      
      expect(results[0]).toEqual({ success: true, echo: { id: 1 } });
      expect(results[1]).toEqual({ success: true, echo: { id: 2 } });
      expect(results[2]).toEqual({ success: true, echo: { id: 3 } });
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      client = new RPCClient();
      await client.connect();
    });

    it('should handle RPC error response', async () => {
      // Override send to return error
      const ws = (client as any).ws;
      ws.send = function(data: string) {
        const request = JSON.parse(data);
        const response = {
          id: request.id,
          error: 'Method not found'
        };
        
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage(new MessageEvent('message', { data: JSON.stringify(response) }));
          }
        }, 0);
      };

      await expect(client.call('test.error', {})).rejects.toThrow('Method not found');
    });

    it('should handle timeout', async () => {
      // Override send to not send response
      const ws = (client as any).ws;
      ws.send = function() {
        // Do nothing - simulate no response
      };

      await expect(client.call('test.timeout', {}, { timeout: 100 })).rejects.toThrow('RPC call timed out: test.timeout');
    });

    it('should handle malformed response', async () => {
      const ws = (client as any).ws;
      ws.send = function() {
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage(new MessageEvent('message', { data: 'invalid json' }));
          }
        }, 0);
      };

      // This won't reject but will log an error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to handle RPC message:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Reconnection', () => {
    it('should attempt to reconnect on disconnect', async () => {
      client = new RPCClient();
      await client.connect();
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Trigger disconnect
      const ws = (client as any).ws;
      ws.close();
      
      // Wait for reconnection attempt
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(consoleSpy).toHaveBeenCalledWith('Attempting to reconnect (1/5)...');
      consoleSpy.mockRestore();
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance for getRPCClient', () => {
      const client1 = getRPCClient();
      const client2 = getRPCClient();
      expect(client1).toBe(client2);
    });

    it('should return same instance for getRPCServices', () => {
      const services1 = getRPCServices();
      const services2 = getRPCServices();
      expect(services1).toBe(services2);
    });
  });
});

describe('RPCServices', () => {
  let client: RPCClient;
  let services: RPCServices;

  beforeEach(async () => {
    client = new RPCClient();
    services = new RPCServices(client);
    await client.connect();
  });

  afterEach(() => {
    client.disconnect();
  });

  describe('AuthService', () => {
    it('should call auth.login', async () => {
      const callSpy = jest.spyOn(client, 'call');
      await services.auth.login('test@example.com', 'password');
      
      expect(callSpy).toHaveBeenCalledWith('auth.login', {
        email: 'test@example.com',
        password: 'password'
      });
    });

    it('should call auth.logout', async () => {
      const callSpy = jest.spyOn(client, 'call');
      await services.auth.logout('test-token');
      
      expect(callSpy).toHaveBeenCalledWith('auth.logout', { token: 'test-token' });
    });

    it('should call auth.refreshToken', async () => {
      const callSpy = jest.spyOn(client, 'call');
      await services.auth.refreshToken('refresh-token');
      
      expect(callSpy).toHaveBeenCalledWith('auth.refreshToken', { refreshToken: 'refresh-token' });
    });
  });

  describe('UserService', () => {
    it('should call user.getUser', async () => {
      const callSpy = jest.spyOn(client, 'call');
      await services.user.getUser('user-123', 'test-token');
      
      expect(callSpy).toHaveBeenCalledWith('user.getUser', {
        userId: 'user-123',
        token: 'test-token'
      });
    });

    it('should call user.updateProfile', async () => {
      const callSpy = jest.spyOn(client, 'call');
      const updates = { name: 'New Name' };
      await services.user.updateProfile('user-123', 'test-token', updates);
      
      expect(callSpy).toHaveBeenCalledWith('user.updateProfile', {
        userId: 'user-123',
        token: 'test-token',
        updates
      });
    });
  });

  describe('ProjectService', () => {
    it('should call project.createProject', async () => {
      const callSpy = jest.spyOn(client, 'call');
      const project = { name: 'Test Project', description: 'Test' };
      await services.project.createProject(project, 'test-token');
      
      expect(callSpy).toHaveBeenCalledWith('project.createProject', {
        project,
        token: 'test-token'
      });
    });

    it('should call project.getProject', async () => {
      const callSpy = jest.spyOn(client, 'call');
      await services.project.getProject('project-123', 'test-token');
      
      expect(callSpy).toHaveBeenCalledWith('project.getProject', {
        projectId: 'project-123',
        token: 'test-token'
      });
    });

    it('should call project.updateProject', async () => {
      const callSpy = jest.spyOn(client, 'call');
      const updates = { name: 'Updated Name' };
      await services.project.updateProject('project-123', updates, 'test-token');
      
      expect(callSpy).toHaveBeenCalledWith('project.updateProject', {
        projectId: 'project-123',
        updates,
        token: 'test-token'
      });
    });

    it('should call project.deleteProject', async () => {
      const callSpy = jest.spyOn(client, 'call');
      await services.project.deleteProject('project-123', 'test-token');
      
      expect(callSpy).toHaveBeenCalledWith('project.deleteProject', {
        projectId: 'project-123',
        token: 'test-token'
      });
    });
  });
});
