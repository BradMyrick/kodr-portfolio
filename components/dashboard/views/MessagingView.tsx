import React, { useState, useEffect } from 'react';
import { messagingApi } from '@/lib/api/client';
import { Message, Room } from '@/types/messaging';
import { DashboardViewProps } from '@/src/types/dashboard';

const MessagingView: React.FC<DashboardViewProps> = ({ isTransitioning, onViewChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Fetch public rooms
    messagingApi.getPublicRooms()
      .then(data => setRooms(data))
      .catch(err => console.error('Failed to fetch rooms', err));
  }, []);

  const handleSendMessage = () => {
    if (messageContent.trim() === '') return;
    
    messagingApi.sendMessage(messageContent)
      .then(newMessage => {
        setMessages([...messages, newMessage]);
        setMessageContent('');
      })
      .catch(err => console.error('Failed to send message', err));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Messaging</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Public Rooms</h2>
        {rooms.map(room => (
          <p key={room.id}>{room.name}</p>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        {messages.map(message => (
          <div key={message.id} className="border-b border-gray-200 mb-2 pb-2">
            <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default MessagingView;

