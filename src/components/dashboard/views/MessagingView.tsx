import React, { useState, useEffect } from 'react';
// import { messagingApi } from '@/lib/api/client';
import { Message, Room, DirectMessage } from '@/types/messaging';
import { DashboardViewProps } from '@/types/dashboard';
import { useUser, useTheme } from '@/stores/useAppStore';

interface User {
  id: string;
  username: string;
  email: string;
}

// Helper function to get display name for sender
const getSenderDisplayName = (senderId: string, users: User[], currentUser: any): string => {
  if (senderId === currentUser?.id) {
    return 'You';
  }
  
  const user = users.find(u => u.id === senderId);
  if (user) {
    return user.username;
  }
  
  // Fallback to a cleaned version of sender_id
  return senderId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'unknown';
};

const MessagingView: React.FC<DashboardViewProps> = ({ isTransitioning, onViewChange }) => {
  const currentUser = useUser();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'rooms' | 'dms'>('rooms');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roomMessages, setRoomMessages] = useState<{[roomId: string]: Message[]}>({});
  const [dmMessages, setDmMessages] = useState<{[userId: string]: DirectMessage[]}>({});
  const [messageContent, setMessageContent] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPublic, setNewRoomPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load public rooms
      // TODO: Replace with RPC call
      // const publicRooms = await messagingApi.getPublicRooms();
      setRooms([]);
      
      // Load users for DM functionality
      try {
        // This will need the backend endpoint to be implemented
        // For now, keep mock users but exclude current user
        const mockUsers = [
          { id: '1', username: 'alice', email: 'alice@example.com' },
          { id: '2', username: 'bob', email: 'bob@example.com' },
          { id: '3', username: 'charlie', email: 'charlie@example.com' }
        ].filter(user => user.id !== currentUser?.id);
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() === '') return;
    
    try {
      // TODO: Replace with RPC call
      // const newRoom = await messagingApi.createRoom(newRoomName, newRoomPublic);
      const newRoom = { id: Date.now().toString(), name: newRoomName, is_public: newRoomPublic, members: [] };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setShowCreateRoom(false);
      // Auto-select the newly created room
      setSelectedRoom(newRoom);
      // Initialize empty messages for this room
      setRoomMessages(prev => ({ ...prev, [newRoom.id]: [] }));
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async (room: Room) => {
    // Always select the room immediately for UI responsiveness
    setSelectedRoom(room);
    
    // Initialize messages if not already loaded
    if (!roomMessages[room.id]) {
      setRoomMessages(prev => ({ ...prev, [room.id]: [] }));
    }
    
    // Try to join the room via API, but don't block UI if it fails
    try {
      // TODO: Replace with RPC call
      // await messagingApi.joinRoom(room.id);
    } catch (error) {
      console.warn('Failed to join room via API, but room is still selectable:', error);
    }
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() === '') return;
    
    try {
      if (activeTab === 'rooms' && selectedRoom) {
        // TODO: Replace with RPC call
        // const newMessage = await messagingApi.sendMessage(messageContent);
        const newMessage = { id: Date.now().toString(), content: messageContent, sender_id: currentUser?.id || 'user', timestamp: Date.now() / 1000 };
        setRoomMessages(prev => ({
          ...prev,
          [selectedRoom.id]: [...(prev[selectedRoom.id] || []), newMessage]
        }));
      } else if (activeTab === 'dms' && selectedUser) {
        // TODO: Replace with RPC call
        // const newDM = await messagingApi.sendDirectMessage(selectedUser.id, messageContent);
        const newDM = { id: Date.now().toString(), content: messageContent, sender_id: currentUser?.id || 'user', recipient_id: selectedUser.id, timestamp: Date.now() / 1000 };
        setDmMessages(prev => ({
          ...prev,
          [selectedUser.id]: [...(prev[selectedUser.id] || []), newDM]
        }));
      }
      setMessageContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLoadDirectMessages = async (user: User) => {
    try {
      // TODO: Replace with RPC call
      // const messages = await messagingApi.getDirectMessages(user.id);
      setDmMessages(prev => ({ ...prev, [user.id]: [] }));
      setSelectedUser(user);
    } catch (error) {
      console.error('Failed to load direct messages:', error);
    }
  };

  const getCurrentMessages = (): (Message | DirectMessage)[] => {
    if (activeTab === 'rooms' && selectedRoom) {
      return roomMessages[selectedRoom.id] || [];
    } else if (activeTab === 'dms' && selectedUser) {
      return dmMessages[selectedUser.id] || [];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading messaging...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-600 flex flex-col bg-white dark:bg-gray-800">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'rooms'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('dms')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'dms'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 border-b-2 border-blue-600'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
            }`}
          >
            Direct Messages
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'rooms' ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Public Rooms</h3>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Create Room
                </button>
              </div>
              
              {showCreateRoom && (
                <div className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
                  <input
                    type="text"
                    placeholder="Room name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="public-room"
                      checked={newRoomPublic}
                      onChange={(e) => setNewRoomPublic(e.target.checked)}
                      className="mr-2 text-blue-600"
                    />
                    <label htmlFor="public-room" className="text-sm text-gray-700 dark:text-gray-300">Public Room</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateRoom}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateRoom(false)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
                <div className="space-y-2">
                {rooms.map(room => (
                  <div
                    key={room.id}
                    onClick={() => handleJoinRoom(room)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white">{room.name}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {room.members.length} members
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {room.is_public ? 'Public' : 'Private'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Users</h3>
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleLoadDirectMessages(user)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">@{user.username}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === 'rooms' && selectedRoom ? selectedRoom.name : 
             activeTab === 'dms' && selectedUser ? `Chat with @${selectedUser.username}` :
             'Select a room or user to start messaging'}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {getCurrentMessages().map((message, index) => {
            const isCurrentUser = message.sender_id === currentUser?.id;
            return (
              <div key={message.id || index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-lg p-3 shadow-sm border ${
                  isCurrentUser 
                    ? 'bg-blue-600 dark:bg-blue-500 text-white ml-12 border-blue-600 dark:border-blue-500' 
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-12 border-gray-200 dark:border-gray-600'
                }`}>
                  {!isCurrentUser && (
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      @{getSenderDisplayName(message.sender_id, users, currentUser)}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-300'
                  }`}>
                    {new Date(message.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        {(selectedRoom || selectedUser) && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-500 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-400"
                rows={3}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors self-end"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingView;

