import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@/stores/useAppStore';

// WebSocket connection states
export enum ConnectionState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR'
}

// Message types matching backend
export enum MessageType {
  CHAT_MESSAGE = 'chatMessage',
  PRESENCE_UPDATE = 'presenceUpdate',
  TYPING = 'typing',
  ROOM_EVENT = 'roomEvent',
  MESSAGE_UPDATE = 'messageUpdate',
  REACTION = 'reaction',
  AI_INSIGHT = 'aiInsight',
  INTEGRATION = 'integration',
  JOIN_ROOM = 'joinRoom',
  LEAVE_ROOM = 'leaveRoom',
  PING = 'ping',
  PONG = 'pong'
}

// Event handlers type
export interface RealtimeHandlers {
  onMessage?: (data: ChatMessage) => void;
  onPresenceUpdate?: (data: PresenceUpdate) => void;
  onTyping?: (data: TypingIndicator) => void;
  onRoomEvent?: (data: RoomEvent) => void;
  onAIInsight?: (data: AIInsight) => void;
  onConnectionChange?: (state: ConnectionState) => void;
  onError?: (error: Error) => void;
}

// Message types
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  mentions?: string[];
  replyTo?: string;
  threadId?: string;
}

export interface Attachment {
  id: string;
  type: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface PresenceUpdate {
  userId: string;
  userName: string;
  status: 'online' | 'away' | 'busy' | 'doNotDisturb' | 'offline';
  lastSeen: number;
  statusMessage?: string;
  activeRooms?: string[];
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  roomId: string;
  isTyping: boolean;
  timestamp: number;
}

export interface RoomEvent {
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  action: 'joined' | 'left' | 'invited' | 'kicked' | 'promoted' | 'demoted';
  timestamp: number;
}

export interface AIInsight {
  roomId: string;
  type: 'summary' | 'actionItems' | 'sentiment' | 'suggestion' | 'warning' | 'automation';
  title: string;
  content: string;
  suggestions?: string[];
  confidence: number;
  context?: any;
  generatedAt: number;
}

// WebSocket configuration
const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws',
  reconnectDelay: 1000,
  reconnectDelayMax: 10000,
  reconnectAttempts: 10,
  heartbeatInterval: 30000,
  messageTimeout: 5000
};

export function useRealtime(handlers: RealtimeHandlers = {}) {
  const user = useUser();
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const handlersRef = useRef(handlers);
  
  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Send message through WebSocket
  const sendMessage = useCallback((type: MessageType, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, ...payload });
      wsRef.current.send(message);
      return true;
    }
    return false;
  }, []);

  // Join a room
  const joinRoom = useCallback((roomId: string) => {
    return sendMessage(MessageType.JOIN_ROOM, { roomId });
  }, [sendMessage]);

  // Leave a room
  const leaveRoom = useCallback((roomId: string) => {
    return sendMessage(MessageType.LEAVE_ROOM, { roomId });
  }, [sendMessage]);

  // Send typing indicator
  const sendTyping = useCallback((roomId: string, isTyping: boolean) => {
    return sendMessage(MessageType.TYPING, { roomId, isTyping });
  }, [sendMessage]);

  // Setup heartbeat
  const setupHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      sendMessage(MessageType.PING, {});
    }, WS_CONFIG.heartbeatInterval);
  }, [sendMessage]);

  // Clear heartbeat
  const clearHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = undefined;
    }
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const { type, ...payload } = data;

      switch (type) {
        case MessageType.CHAT_MESSAGE:
          handlersRef.current.onMessage?.(payload as ChatMessage);
          break;
          
        case MessageType.PRESENCE_UPDATE:
          handlersRef.current.onPresenceUpdate?.(payload as PresenceUpdate);
          break;
          
        case MessageType.TYPING:
          handlersRef.current.onTyping?.(payload as TypingIndicator);
          break;
          
        case MessageType.ROOM_EVENT:
          handlersRef.current.onRoomEvent?.(payload as RoomEvent);
          break;
          
        case MessageType.AI_INSIGHT:
          handlersRef.current.onAIInsight?.(payload as AIInsight);
          break;
          
        case MessageType.PONG:
          // Heartbeat response - connection is alive
          break;
          
        default:
          console.warn('Unknown message type:', type);
      }
    } catch (err) {
      console.error('Failed to parse WebSocket message:', err);
      setError(err as Error);
      handlersRef.current.onError?.(err as Error);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setConnectionState(ConnectionState.CONNECTING);
    handlersRef.current.onConnectionChange?.(ConnectionState.CONNECTING);

    try {
      // Get auth token
      const token = localStorage.getItem('auth_token');
      const wsUrl = token 
        ? `${WS_CONFIG.url}?token=${encodeURIComponent(token)}`
        : WS_CONFIG.url;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState(ConnectionState.CONNECTED);
        handlersRef.current.onConnectionChange?.(ConnectionState.CONNECTED);
        setError(null);
        reconnectAttemptsRef.current = 0;
        setupHeartbeat();
      };

      ws.onmessage = handleMessage;

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const error = new Error('WebSocket connection error');
        setError(error);
        handlersRef.current.onError?.(error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        wsRef.current = null;
        clearHeartbeat();
        
        if (event.code !== 1000) { // Not a normal closure
          setConnectionState(ConnectionState.DISCONNECTED);
          handlersRef.current.onConnectionChange?.(ConnectionState.DISCONNECTED);
          
          // Attempt reconnection
          if (reconnectAttemptsRef.current < WS_CONFIG.reconnectAttempts) {
            const delay = Math.min(
              WS_CONFIG.reconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
              WS_CONFIG.reconnectDelayMax
            );
            
            setConnectionState(ConnectionState.RECONNECTING);
            handlersRef.current.onConnectionChange?.(ConnectionState.RECONNECTING);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++;
              connect();
            }, delay);
          } else {
            setConnectionState(ConnectionState.ERROR);
            handlersRef.current.onConnectionChange?.(ConnectionState.ERROR);
            const error = new Error('Max reconnection attempts reached');
            setError(error);
            handlersRef.current.onError?.(error);
          }
        }
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setConnectionState(ConnectionState.ERROR);
      handlersRef.current.onConnectionChange?.(ConnectionState.ERROR);
      setError(err as Error);
      handlersRef.current.onError?.(err as Error);
    }
  }, [handleMessage, setupHeartbeat, clearHeartbeat]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    
    clearHeartbeat();
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    
    setConnectionState(ConnectionState.DISCONNECTED);
    handlersRef.current.onConnectionChange?.(ConnectionState.DISCONNECTED);
  }, [clearHeartbeat]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (user?.id) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [user?.id, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      clearHeartbeat();
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [clearHeartbeat]);

  return {
    connectionState,
    error,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendTyping,
    isConnected: connectionState === ConnectionState.CONNECTED,
    isConnecting: connectionState === ConnectionState.CONNECTING || connectionState === ConnectionState.RECONNECTING
  };
}