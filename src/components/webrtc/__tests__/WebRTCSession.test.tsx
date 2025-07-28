import React from 'react';
import { render, screen } from '@testing-library/react';
import WebRTCSession from '../WebRTCSession';
import { useWebRTC } from '../../../hooks/useWebRTC';

// Mock the useWebRTC hook
jest.mock('../../../hooks/useWebRTC');

describe('WebRTCSession', () => {
  const mockUseWebRTC = useWebRTC as jest.MockedFunction<typeof useWebRTC>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    mockUseWebRTC.mockReturnValue({ connected: false });
  });

  it('should render room ID', () => {
    render(<WebRTCSession roomId="test-room-123" />);
    
    expect(screen.getByText('WebRTC Room: test-room-123')).toBeInTheDocument();
  });

  it('should show disconnected status when not connected', () => {
    mockUseWebRTC.mockReturnValue({ connected: false });
    
    render(<WebRTCSession roomId="test-room" />);
    
    expect(screen.getByText('Status: Disconnected')).toBeInTheDocument();
  });

  it('should show connected status when connected', () => {
    mockUseWebRTC.mockReturnValue({ connected: true });
    
    render(<WebRTCSession roomId="test-room" />);
    
    expect(screen.getByText('Status: Connected')).toBeInTheDocument();
  });

  it('should render empty peer list by default', () => {
    render(<WebRTCSession roomId="test-room" />);
    
    // Should not find any peer info elements
    const peerInfoElements = screen.queryAllByText(/Peer:/);
    expect(peerInfoElements).toHaveLength(0);
  });

  it('should log to console when connected', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Start disconnected
    const { rerender } = render(<WebRTCSession roomId="test-room" />);
    
    // Change to connected
    mockUseWebRTC.mockReturnValue({ connected: true });
    rerender(<WebRTCSession roomId="test-room" />);
    
    expect(consoleSpy).toHaveBeenCalledWith('Connected to WebRTC room:', 'test-room');
    
    consoleSpy.mockRestore();
  });

  it('should handle room ID changes', () => {
    const { rerender } = render(<WebRTCSession roomId="room-1" />);
    
    expect(screen.getByText('WebRTC Room: room-1')).toBeInTheDocument();
    
    // Change room ID
    rerender(<WebRTCSession roomId="room-2" />);
    
    expect(screen.getByText('WebRTC Room: room-2')).toBeInTheDocument();
  });

  it('should call useWebRTC with correct room ID', () => {
    render(<WebRTCSession roomId="specific-room" />);
    
    expect(mockUseWebRTC).toHaveBeenCalledWith('specific-room');
  });

  // Test for future peer functionality
  it('should render peer list when peers are available', () => {
    // This test is for future implementation when setPeers is used
    // Currently, the component has an empty peers array
    const { container } = render(<WebRTCSession roomId="test-room" />);
    
    // Verify the peer list container exists even if empty
    const sessionElement = container.querySelector('.webrtc-session');
    expect(sessionElement).toBeInTheDocument();
  });
});
