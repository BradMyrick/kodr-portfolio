import { renderHook, act } from '@testing-library/react';
import { useWebRTC } from '../useWebRTC';

// Mock RTCPeerConnection
const mockRTCPeerConnection = {
  close: jest.fn(),
  onicecandidate: null,
  onconnectionstatechange: null,
  connectionState: 'new',
};

global.RTCPeerConnection = jest.fn().mockImplementation(() => mockRTCPeerConnection) as any;

describe('useWebRTC', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRTCPeerConnection.close.mockClear();
    mockRTCPeerConnection.connectionState = 'new';
  });

  it('should initialize WebRTC connection and return connection state', () => {
    const { result } = renderHook(() => useWebRTC('test-room'));
    
    // Initially disconnected
    expect(result.current.connected).toBe(false);
    
    // Creates RTCPeerConnection with STUN server
    expect(global.RTCPeerConnection).toHaveBeenCalledWith({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
  });

  it('should update connected state when WebRTC connection is established', () => {
    const { result } = renderHook(() => useWebRTC('test-room'));
    
    expect(result.current.connected).toBe(false);
    
    // Simulate connection established
    act(() => {
      mockRTCPeerConnection.connectionState = 'connected';
      mockRTCPeerConnection.onconnectionstatechange!({} as any);
    });
    
    expect(result.current.connected).toBe(true);
  });

  it('should clean up connection on room change', () => {
    const { rerender } = renderHook(
      ({ roomId }) => useWebRTC(roomId),
      { initialProps: { roomId: 'room-1' } }
    );
    
    expect(global.RTCPeerConnection).toHaveBeenCalledTimes(1);
    
    // Change room ID should close old connection and create new one
    rerender({ roomId: 'room-2' });
    
    expect(mockRTCPeerConnection.close).toHaveBeenCalledTimes(1);
    expect(global.RTCPeerConnection).toHaveBeenCalledTimes(2);
  });
});
