import React, { useEffect, useState } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';

interface WebRTCSessionProps {
  roomId: string;
}

const WebRTCSession: React.FC<WebRTCSessionProps> = ({ roomId }) => {
  const { connected } = useWebRTC(roomId);
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    // Handle peer connections
    if (connected) {
      console.log('Connected to WebRTC room:', roomId);
      // TODO: Implement peer connection logic
    }
  }, [connected]);

  return (
    <div className="webrtc-session">
      <h4>WebRTC Room: {roomId}</h4>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      {/* Display peer list */}
      {peers.map((peer, index) => (
        <div key={index} className="peer-info">
          <p>Peer: {peer.id}</p>
          <p>Name: {peer.name}</p>
        </div>
      ))}
    </div>
  );
};

export default WebRTCSession;
