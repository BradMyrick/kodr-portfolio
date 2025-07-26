/**
 * Cap'n Proto RPC Client for communication with backend services
 */

import { Client as CapnpClient } from '@capnp-ts/rpc';
import { WebSocketTransport } from '@capnp-ts/websocket-transport';

export class RPCClient {
  private client: CapnpClient | null = null;
  private transport: WebSocketTransport | null = null;
  private url: string;

  constructor(url: string = process.env.NEXT_PUBLIC_RPC_URL || 'ws://localhost:8081') {
    this.url = url;
  }

  /**
   * Connect to the RPC server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.transport = new WebSocketTransport(this.url);
        this.client = new CapnpClient(this.transport);
        
        this.transport.on('open', () => {
          console.log('RPC connection established');
          resolve();
        });
        
        this.transport.on('error', (error) => {
          console.error('RPC connection error:', error);
          reject(error);
        });
        
        this.transport.on('close', () => {
          console.log('RPC connection closed');
          this.client = null;
          this.transport = null;
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the RPC server
   */
  disconnect(): void {
    if (this.transport) {
      this.transport.close();
    }
    this.client = null;
    this.transport = null;
  }

  /**
   * Get the RPC client instance
   */
  getClient(): CapnpClient | null {
    return this.client;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.client !== null;
  }
}

// Singleton instance
let rpcClientInstance: RPCClient | null = null;

/**
 * Get or create the RPC client singleton
 */
export function getRPCClient(): RPCClient {
  if (!rpcClientInstance) {
    rpcClientInstance = new RPCClient();
  }
  return rpcClientInstance;
}
