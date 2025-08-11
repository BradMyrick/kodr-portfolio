import { useEffect, useState } from 'react';
import { getRPCClient, getRPCServices } from '@/lib/rpc/client';

export function useRPC() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = getRPCClient();
    
    // Check if already connected
    if (client.isConnected()) {
      setConnected(true);
      return;
    }

    // Connect to RPC server
    const connect = async () => {
      setConnecting(true);
      setError(null);
      
      try {
        await client.connect();
        setConnected(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to RPC server');
        setConnected(false);
      } finally {
        setConnecting(false);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      // Note: We don't disconnect here as it's a singleton
      // and other components might be using it
    };
  }, []);

  return {
    connected,
    connecting,
    error,
    services: getRPCServices(),
    client: getRPCClient()
  };
}

// Example usage in a component:
/*
function MyComponent() {
  const { connected, services } = useRPC();
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    if (!connected) return;
    
    try {
      const result = await services.auth.login('user@example.com', 'password');
      console.log('Login successful:', result);
      
      // Get user details
      const userDetails = await services.user.getUser(result.user.id, result.token);
      setUser(userDetails);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {connected ? (
        <button onClick={handleLogin}>Login via RPC</button>
      ) : (
        <p>Connecting to RPC server...</p>
      )}
    </div>
  );
}
*/
