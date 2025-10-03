import { Message, Struct, Uint64 } from 'capnp-ts';

export interface BinaryMessage {
  id: string;
  senderId: string;
  content: string;
  roomId: string;
  timestamp: number;
}

export interface BinaryRoom {
  id: string;
  name: string;
  isPublic: boolean;
  members?: string[];
}

export interface WebSocketRequest {
  id: string;
  method: string;
  timestamp: number;
  params?: any;
}

export interface WebSocketResponse {
  id: string;
  success: boolean;
  timestamp: number;
  result?: any;
  error?: string;
}

export interface RealtimeEvent {
  id: string;
  timestamp: number;
  event: any;
}

type MessageCallback = (data: any) => void;
type EventCallback = (event: RealtimeEvent) => void;

export class BinaryWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: ArrayBuffer[] = [];
  private isConnected = false;
  private requestCallbacks = new Map<string, MessageCallback>();
  private eventCallbacks = new Set<EventCallback>();
  
  constructor(url: string) {
    this.url = url;
  }
  
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = token ? `${this.url}?token=${token}` : this.url;
      
      try {
        this.ws = new WebSocket(wsUrl);
        this.ws.binaryType = 'arraybuffer';
        
        this.ws.onopen = () => {
          console.log('Binary WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.flushMessageQueue();
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
        
        this.ws.onerror = (error) => {
          console.error('Binary WebSocket error:', error);
          reject(error);
        };
        
        this.ws.onclose = () => {
          console.log('Binary WebSocket disconnected');
          this.isConnected = false;
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  private handleMessage(data: ArrayBuffer) {
    try {
      // Parse the binary message
      const message = new Message(data, false);
      const root = message.getRoot(Struct);
      
      // Check if it's a response or an event
      // For now, we'll use a simple heuristic
      const hasEvent = root.getPointer(1); // Assuming event field is at position 1
      
      if (hasEvent) {
        // It's a realtime event
        const event = this.parseRealtimeEvent(root);
        this.eventCallbacks.forEach(callback => callback(event));
      } else {
        // It's a response to a request
        const response = this.parseResponse(root);
        const callback = this.requestCallbacks.get(response.id);
        if (callback) {
          callback(response);
          this.requestCallbacks.delete(response.id);
        }
      }
    } catch (error) {
      console.error('Failed to parse binary message:', error);
    }
  }
  
  private parseResponse(root: Struct): WebSocketResponse {
    // Parse the Cap'n Proto response structure
    // This is a simplified version - you'd need to match your actual schema
    return {
      id: root.getText(0) || '',
      success: root.getBool(1),
      timestamp: parseInt(root.getUint64(2) as unknown as string),
      result: root.getPointer(3),
      error: root.getText(4)
    };
  }
  
  private parseRealtimeEvent(root: Struct): RealtimeEvent {
    // Parse the Cap'n Proto event structure
    return {
      id: root.getText(0) || '',
      timestamp: parseInt(root.getUint64(1) as unknown as string),
      event: root.getPointer(2)
    };
  }
  
  sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = this.generateId();
      
      // Create the binary request
      const request = this.createBinaryRequest({
        id: requestId,
        method,
        timestamp: Date.now(),
        params
      });
      
      // Set up callback for response
      this.requestCallbacks.set(requestId, (response) => {
        if (response.success) {
          resolve(response.result);
        } else {
          reject(new Error(response.error || 'Request failed'));
        }
      });
      
      // Send the request
      this.send(request);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.requestCallbacks.has(requestId)) {
          this.requestCallbacks.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }
  
  private createBinaryRequest(request: WebSocketRequest): ArrayBuffer {
    // Create a new Cap'n Proto message
    const message = new Message();
    const root = message.initRoot(Struct);
    
    // Set the request fields
    root.setText(0, request.id);
    root.setText(1, request.method);
    root.setUint64(2, Uint64.fromNumber(request.timestamp));
    
    // Set params based on method
    if (request.params) {
      const params = root.initStruct(3);
      this.encodeParams(params, request.method, request.params);
    }
    
    // Convert to ArrayBuffer
    return message.toArrayBuffer();
  }
  
  private encodeParams(params: Struct, method: string, data: any) {
    // Encode parameters based on the method
    switch (method) {
      case 'sendMessage':
        params.setText(0, data.roomId);
        params.setText(1, data.content);
        if (data.replyTo) {
          params.setText(2, data.replyTo);
        }
        break;
      case 'joinRoom':
        params.setText(0, data.roomId);
        break;
      case 'leaveRoom':
        params.setText(0, data.roomId);
        break;
      case 'getMessages':
        params.setText(0, data.roomId);
        params.setUint32(1, data.limit || 50);
        if (data.before) {
          params.setText(2, data.before);
        }
        break;
      case 'createRoom':
        params.setText(0, data.name);
        params.setText(1, data.description || '');
        params.setBool(2, data.isPublic !== false);
        break;
      case 'typing':
        params.setText(0, data.roomId);
        params.setBool(1, data.isTyping);
        break;
      // Add more methods as needed
    }
  }
  
  onEvent(callback: EventCallback) {
    this.eventCallbacks.add(callback);
    return () => this.eventCallbacks.delete(callback);
  }
  
  private send(data: ArrayBuffer) {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.messageQueue.push(data);
    }
  }
  
  private flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting reconnection in ${delay}ms...`);
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }
  
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  disconnect() {
    if (this.ws) {
      this.isConnected = false;
      this.ws.close();
      this.ws = null;
    }
  }
  
  // High-level API methods
  
  async sendMessage(roomId: string, content: string, replyTo?: string): Promise<BinaryMessage> {
    return this.sendRequest('sendMessage', { roomId, content, replyTo });
  }
  
  async joinRoom(roomId: string): Promise<void> {
    return this.sendRequest('joinRoom', { roomId });
  }
  
  async leaveRoom(roomId: string): Promise<void> {
    return this.sendRequest('leaveRoom', { roomId });
  }
  
  async getMessages(roomId: string, limit = 50, before?: string): Promise<BinaryMessage[]> {
    return this.sendRequest('getMessages', { roomId, limit, before });
  }
  
  async getRooms(publicOnly = false): Promise<BinaryRoom[]> {
    return this.sendRequest('getRooms', { publicOnly });
  }
  
  async createRoom(name: string, description: string, isPublic = true): Promise<BinaryRoom> {
    return this.sendRequest('createRoom', { name, description, isPublic });
  }
  
  async sendTypingIndicator(roomId: string, isTyping: boolean): Promise<void> {
    return this.sendRequest('typing', { roomId, isTyping });
  }
}

// Singleton instance
let binaryWebSocketClient: BinaryWebSocketClient | null = null;

export function getBinaryWebSocketClient(url?: string): BinaryWebSocketClient {
  if (!binaryWebSocketClient && url) {
    binaryWebSocketClient = new BinaryWebSocketClient(url);
  }
  
  if (!binaryWebSocketClient) {
    throw new Error('Binary WebSocket client not initialized');
  }
  
  return binaryWebSocketClient;
}