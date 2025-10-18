'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { BinaryWebSocketClient, BinaryMessage, BinaryRoom, RealtimeEvent } from '@/lib/binaryWebSocket';
import { useAuthStore } from '@/stores/authStore';

interface UseBinaryWebSocketReturn {
  isConnected: boolean;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  getMessages: (roomId: string, limit?: number) => Promise<BinaryMessage[]>;
  getRooms: () => Promise<BinaryRoom[]>;
  createRoom: (name: string, description: string, isPublic?: boolean) => Promise<BinaryRoom>;
  sendTypingIndicator: (roomId: string, isTyping: boolean) => Promise<void>;
  onMessage: (callback: (message: BinaryMessage) => void) => () => void;
  onTyping: (callback: (data: any) => void) => () => void;
  messages: BinaryMessage[];
  rooms: BinaryRoom[];
}

export function useBinaryWebSocket(): UseBinaryWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<BinaryMessage[]>([]);
  const [rooms, setRooms] = useState<BinaryRoom[]>([]);
  const clientRef = useRef<BinaryWebSocketClient | null>(null);
  const messageCallbacks = useRef<Set<(msg: BinaryMessage) => void>>(new Set());
  const typingCallbacks = useRef<Set<(data: any) => void>>(new Set());
  const { token } = useAuthStore();

  useEffect(() => {
    // Initialize WebSocket client
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL?.replace('/ws', '/ws/binary') || 
                  'ws://localhost:8080/ws/binary';
    
    const client = new BinaryWebSocketClient(wsUrl);
    clientRef.current = client;

    // Connect to WebSocket
    client.connect(token).then(() => {
      setIsConnected(true);
      console.log('Binary WebSocket connected successfully');
    }).catch((error) => {
      console.error('Failed to connect to binary WebSocket:', error);
      setIsConnected(false);
    });

    // Set up event listeners
    const unsubscribe = client.onEvent((event: RealtimeEvent) => {
      handleRealtimeEvent(event);
    });

    return () => {
      unsubscribe();
      client.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  const handleRealtimeEvent = useCallback((event: RealtimeEvent) => {
    // Parse event type from the event union
    // This is simplified - you'd need to properly parse the Cap'n Proto union
    const eventData = event.event;
    
    if (eventData && eventData.type === 'newMessage') {
      const message: BinaryMessage = {
        id: eventData.id,
        senderId: eventData.senderId,
        content: eventData.content,
        roomId: eventData.roomId,
        timestamp: eventData.timestamp
      };
      
      setMessages(prev => [...prev, message]);
      messageCallbacks.current.forEach(cb => cb(message));
    } else if (eventData && eventData.type === 'typing') {
      typingCallbacks.current.forEach(cb => cb(eventData));
    }
  }, []);

  const sendMessage = useCallback(async (roomId: string, content: string) => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    const message = await clientRef.current.sendMessage(roomId, content);
    setMessages(prev => [...prev, message]);
  }, []);

  const joinRoom = useCallback(async (roomId: string) => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    await clientRef.current.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback(async (roomId: string) => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    await clientRef.current.leaveRoom(roomId);
  }, []);

  const getMessages = useCallback(async (roomId: string, limit = 50): Promise<BinaryMessage[]> => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    const fetchedMessages = await clientRef.current.getMessages(roomId, limit);
    setMessages(fetchedMessages);
    return fetchedMessages;
  }, []);

  const getRooms = useCallback(async (): Promise<BinaryRoom[]> => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    const fetchedRooms = await clientRef.current.getRooms();
    setRooms(fetchedRooms);
    return fetchedRooms;
  }, []);

  const createRoom = useCallback(async (name: string, description: string, isPublic = true): Promise<BinaryRoom> => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    const room = await clientRef.current.createRoom(name, description, isPublic);
    setRooms(prev => [...prev, room]);
    return room;
  }, []);

  const sendTypingIndicator = useCallback(async (roomId: string, isTyping: boolean) => {
    if (!clientRef.current) {
      throw new Error('WebSocket not connected');
    }

    await clientRef.current.sendTypingIndicator(roomId, isTyping);
  }, []);

  const onMessage = useCallback((callback: (message: BinaryMessage) => void) => {
    messageCallbacks.current.add(callback);
    return () => messageCallbacks.current.delete(callback);
  }, []);

  const onTyping = useCallback((callback: (data: any) => void) => {
    typingCallbacks.current.add(callback);
    return () => typingCallbacks.current.delete(callback);
  }, []);

  return {
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    getMessages,
    getRooms,
    createRoom,
    sendTypingIndicator,
    onMessage,
    onTyping,
    messages,
    rooms,
  };
}