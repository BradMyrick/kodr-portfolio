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
    mockUseWebRTC.mockReturnValue({ connected: false });
  });

  it('should render room ID and connection status', () => {
    render(<WebRTCSession roomId="test-room-123" />);
    
    expect(screen.getByText('WebRTC Room: test-room-123')).toBeInTheDocument();
    expect(screen.getByText('Status: Disconnected')).toBeInTheDocument();
  });

  it('should show connected status when WebRTC is connected', () => {
    mockUseWebRTC.mockReturnValue({ connected: true });
    
    render(<WebRTCSession roomId="test-room" />);
    
    expect(screen.getByText('Status: Connected')).toBeInTheDocument();
  });

  it('should call useWebRTC with correct room ID', () => {
    render(<WebRTCSession roomId="specific-room" />);
    
    expect(mockUseWebRTC).toHaveBeenCalledWith('specific-room');
  });
});
