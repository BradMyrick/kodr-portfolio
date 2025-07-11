import React, { useState, useEffect } from 'react';
import { messagingApi } from '@/lib/api/client';
import { Message, Room, DirectMessage } from '@/types/messaging';
import { DashboardViewProps } from '@/src/types/dashboard';

interface User {
  id: string;
  name: string;
  email: string;
}

const MessagingView: React.FC<DashboardViewProps> = ({ isTransitioning, onViewChange }) => {
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
      const publicRooms = await messagingApi.getPublicRooms();
      setRooms(publicRooms);
      
      // Load users for DM functionality
      // Note: This assumes we have a users endpoint
      // For now, we'll create a mock user list
      setUsers([
        { id: '1', name: 'Alice Developer', email: 'alice@example.com' },
        { id: '2', name: 'Bob Engineer', email: 'bob@example.com' },
        { id: '3', name: 'Charlie Designer', email: 'charlie@example.com' }
      ]);
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() === '') return;
    
    try {
      const newRoom = await messagingApi.createRoom(newRoomName, newRoomPublic);
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async (room: Room) => {
    try {
      await messagingApi.joinRoom(room.id);
      setSelectedRoom(room);
      // Load messages for this room if we haven't already
      if (!roomMessages[room.id]) {
        // For now, we'll just set empty messages since we don't have the endpoint
        setRoomMessages(prev => ({ ...prev, [room.id]: [] }));
      }
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() === '') return;
    
    try {
      if (activeTab === 'rooms' && selectedRoom) {
        const newMessage = await messagingApi.sendMessage(messageContent);
        setRoomMessages(prev => ({
          ...prev,
          [selectedRoom.id]: [...(prev[selectedRoom.id] || []), newMessage]
        }));
      } else if (activeTab === 'dms' && selectedUser) {
        const newDM = await messagingApi.sendDirectMessage(selectedUser.id, messageContent);
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
      const messages = await messagingApi.getDirectMessages(user.id);
      setDmMessages(prev => ({ ...prev, [user.id]: messages }));
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading messaging...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'rooms'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('dms')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'dms'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
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
                <h3 className="text-lg font-semibold">Public Rooms</h3>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Create Room
                </button>
              </div>
              
              {showCreateRoom && (
                <div className="mb-4 p-3 border rounded bg-gray-50">
                  <input
                    type="text"
                    placeholder="Room name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="public-room"
                      checked={newRoomPublic}
                      onChange={(e) => setNewRoomPublic(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="public-room" className="text-sm">Public Room</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateRoom}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateRoom(false)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
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
                        ? 'bg-blue-100 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{room.name}</h4>
                      <span className="text-xs text-gray-500">
                        {room.members.length} members
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {room.is_public ? 'Public' : 'Private'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Users</h3>
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleLoadDirectMessages(user)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-blue-100 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
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
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold">
            {activeTab === 'rooms' && selectedRoom ? selectedRoom.name : 
             activeTab === 'dms' && selectedUser ? `Chat with ${selectedUser.name}` :
             'Select a room or user to start messaging'}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {getCurrentMessages().map((message, index) => (
            <div key={message.id || index} className="flex flex-col">
              <div className="bg-gray-100 rounded-lg p-3 max-w-2xl">
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        {(selectedRoom || selectedUser) && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg resize-none"
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
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 self-end"
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

