// Mock the dependencies before importing
jest.mock('@capnp-ts/rpc', () => ({
  Client: jest.fn(),
}), { virtual: true });

jest.mock('@capnp-ts/websocket-transport', () => ({
  WebSocketTransport: jest.fn(),
}), { virtual: true });

import { RPCClient, getRPCClient } from '../client';

describe('RPCClient', () => {
  let mockTransport: any;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    mockTransport = {
      on: jest.fn(),
      close: jest.fn(),
    };
    
    mockClient = {};

    // Mock the WebSocketTransport constructor
    const WebSocketTransport = require('@capnp-ts/websocket-transport').WebSocketTransport;
    WebSocketTransport.mockImplementation(() => mockTransport);
    
    // Mock the Client constructor
    const Client = require('@capnp-ts/rpc').Client;
    Client.mockImplementation(() => mockClient);
  });

  describe('constructor', () => {
    it('should use default URL when no URL provided', () => {
      const client = new RPCClient();
      expect(client).toBeDefined();
    });

    it('should use provided URL', () => {
      const customUrl = 'ws://custom-server:9999';
      const client = new RPCClient(customUrl);
      expect(client).toBeDefined();
    });
  });

  describe('connect', () => {
    it('should establish connection successfully', async () => {
      const client = new RPCClient();
      
      // Setup mock to trigger open event
      mockTransport.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'open') {
          setTimeout(() => callback(), 0);
        }
      });

      await client.connect();
      
      expect(mockTransport.on).toHaveBeenCalledWith('open', expect.any(Function));
      expect(mockTransport.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockTransport.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('should handle connection errors', async () => {
      const client = new RPCClient();
      const testError = new Error('Connection failed');
      
      // Setup mock to trigger error event
      mockTransport.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'error') {
          setTimeout(() => callback(testError), 0);
        }
      });

      await expect(client.connect()).rejects.toThrow('Connection failed');
    });

    it('should handle connection close event', async () => {
      const client = new RPCClient();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Setup mock handlers
      let closeHandler: Function;
      mockTransport.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'open') {
          setTimeout(() => callback(), 0);
        } else if (event === 'close') {
          closeHandler = callback;
        }
      });

      await client.connect();
      
      // Trigger close event
      closeHandler!();
      
      expect(consoleSpy).toHaveBeenCalledWith('RPC connection closed');
      expect(client.isConnected()).toBe(false);
      
      consoleSpy.mockRestore();
    });
  });

  describe('disconnect', () => {
    it('should close transport when connected', async () => {
      const client = new RPCClient();
      
      // Setup connection
      mockTransport.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'open') {
          setTimeout(() => callback(), 0);
        }
      });

      await client.connect();
      
      client.disconnect();
      
      expect(mockTransport.close).toHaveBeenCalled();
      expect(client.isConnected()).toBe(false);
    });

    it('should handle disconnect when not connected', () => {
      const client = new RPCClient();
      
      // Should not throw
      expect(() => client.disconnect()).not.toThrow();
    });
  });

  describe('getClient', () => {
    it('should return client when connected', async () => {
      const client = new RPCClient();
      
      // Setup connection
      mockTransport.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'open') {
          setTimeout(() => callback(), 0);
        }
      });

      await client.connect();
      
      expect(client.getClient()).toBe(mockClient);
    });

    it('should return null when not connected', () => {
      const client = new RPCClient();
      expect(client.getClient()).toBeNull();
    });
  });

  describe('isConnected', () => {
    it('should return true when connected', async () => {
      const client = new RPCClient();
      
      // Setup connection
      mockTransport.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'open') {
          setTimeout(() => callback(), 0);
        }
      });

      await client.connect();
      
      expect(client.isConnected()).toBe(true);
    });

    it('should return false when not connected', () => {
      const client = new RPCClient();
      expect(client.isConnected()).toBe(false);
    });
  });

  describe('getRPCClient singleton', () => {
    it('should return the same instance', () => {
      const client1 = getRPCClient();
      const client2 = getRPCClient();
      
      expect(client1).toBe(client2);
    });
  });
});
