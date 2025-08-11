import { RPCClient, RPCServices, getRPCClient, getRPCServices } from '../client';

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number = 0;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  static OPEN = 1;
  static CLOSED = 3;

  constructor(url: string) {
    this.url = url;
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

(global as any).WebSocket = MockWebSocket;

describe('RPCClient', () => {
  let client: RPCClient;

  afterEach(() => {
    if (client && client.isConnected()) {
      client.disconnect();
    }
  });

  it('should connect and make successful RPC calls', async () => {
    client = new RPCClient('ws://localhost:8080/rpc');
    await client.connect();
    expect(client.isConnected()).toBe(true);

    const result = await client.call('test.method', { foo: 'bar' });
    expect(result).toEqual({ success: true, echo: { foo: 'bar' } });
  });

  it('should handle RPC errors', async () => {
    client = new RPCClient();
    await client.connect();

    // Mock error response
    const ws = (client as any).ws;
    ws.send = function(data: string) {
      const request = JSON.parse(data);
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', { 
            data: JSON.stringify({ id: request.id, error: 'Method not found' })
          }));
        }
      }, 0);
    };

    await expect(client.call('invalid.method')).rejects.toThrow('Method not found');
  });

  it('should throw when calling without connection', async () => {
    client = new RPCClient();
    await expect(client.call('test.method', {})).rejects.toThrow('Not connected to RPC server');
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
      
      expect(callSpy).toHaveBeenCalledWith('auth.logout', { 
        accessToken: 'test-token', 
        refreshToken: undefined 
      });
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
