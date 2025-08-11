import React from 'react';
import { render, screen } from '@testing-library/react';
import EventViewer from '../EventViewer';

// Mock fetch
global.fetch = jest.fn();

describe('EventViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    const { container } = render(<EventViewer entityId="test-id" entityType="project" />);
    
    // Check for loading spinner by class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<EventViewer entityId="test-id" entityType="project" />);
    
    // Wait for error message
    const errorMessage = await screen.findByText(/Error loading events/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders empty state when no events', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
    });

    render(<EventViewer entityId="test-id" entityType="project" />);
    
    // Wait for empty state message
    const emptyMessage = await screen.findByText(/No events found/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  it('fetches events with correct parameters', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
    });

    render(<EventViewer entityId="user-123" entityType="user" limit={25} />);
    
    expect(fetch).toHaveBeenCalledWith(
      '/api/events?entityId=user-123&entityType=user&limit=25'
    );
  });
});
