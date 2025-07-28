import { renderHook, act, waitFor } from '@testing-library/react';
import { useRPC } from '../useRPC';
import { getRPCClient } from '@/lib/rpc/client';

// Mock the RPC client
jest.mock('@/lib/rpc/client', () => ({
  getRPCClient: jest.fn(),
  getRPCServices: jest.fn(() => ({
    auth: {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn()
    },
    user: {
      getUser: jest.fn(),
      updateProfile: jest.fn()
    },
    project: {
      createProject: jest.fn(),
      getProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn()
    }
  }))
}));

describe('useRPC', () => {
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockClient = {
      isConnected: jest.fn(() => false),
      connect: jest.fn(),
      disconnect: jest.fn()
    };
    
    (getRPCClient as jest.Mock).mockReturnValue(mockClient);
  });

  it('should connect to RPC server on mount', async () => {
    mockClient.connect.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useRPC());
    
    expect(result.current.connecting).toBe(true);
    expect(result.current.connected).toBe(false);
    
    await waitFor(() => {
      expect(result.current.connecting).toBe(false);
      expect(result.current.connected).toBe(true);
    });
    
    expect(mockClient.connect).toHaveBeenCalledTimes(1);
  });

  it('should return connected true if already connected', () => {
    mockClient.isConnected.mockReturnValue(true);
    
    const { result } = renderHook(() => useRPC());
    
    expect(result.current.connected).toBe(true);
    expect(result.current.connecting).toBe(false);
    expect(mockClient.connect).not.toHaveBeenCalled();
  });

  it('should handle connection errors', async () => {
    const error = new Error('Connection failed');
    mockClient.connect.mockRejectedValue(error);
    
    const { result } = renderHook(() => useRPC());
    
    await waitFor(() => {
      expect(result.current.connecting).toBe(false);
      expect(result.current.connected).toBe(false);
      expect(result.current.error).toBe('Connection failed');
    });
  });

  it('should provide RPC services', () => {
    const { result } = renderHook(() => useRPC());
    
    expect(result.current.services).toBeDefined();
    expect(result.current.services.auth).toBeDefined();
    expect(result.current.services.user).toBeDefined();
    expect(result.current.services.project).toBeDefined();
  });

  it('should provide RPC client instance', () => {
    const { result } = renderHook(() => useRPC());
    
    expect(result.current.client).toBe(mockClient);
  });

  it('should not disconnect on unmount (singleton)', () => {
    const { unmount } = renderHook(() => useRPC());
    
    unmount();
    
    expect(mockClient.disconnect).not.toHaveBeenCalled();
  });

  it('should handle non-Error exceptions in connection', async () => {
    mockClient.connect.mockRejectedValue('String error');
    
    const { result } = renderHook(() => useRPC());
    
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to connect to RPC server');
    });
  });
});
