'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, User, FileText, MessageSquare, GitBranch } from 'lucide-react';

interface Event {
  id: string;
  timestamp: string;
  entityId: string;
  entityType: string;
  eventType: string;
  userId: string;
  data: Record<string, any>;
  metadata: {
    version: number;
    source: string;
    correlationId?: string;
    causationId?: string;
  };
}

interface EventViewerProps {
  entityId: string;
  entityType: 'user' | 'project' | 'idea' | 'message' | 'milestone';
  limit?: number;
}

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  project: FileText,
  idea: GitBranch,
  message: MessageSquare,
  milestone: Clock,
};

export default function EventViewer({ entityId, entityType, limit = 50 }: EventViewerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [entityId, entityType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(
        `/api/events?entityId=${entityId}&entityType=${entityType}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (eventType: string): string => {
    if (eventType.includes('created')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (eventType.includes('updated')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (eventType.includes('deleted')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const formatEventType = (eventType: string): string => {
    return eventType.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || eventType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        Error loading events: {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No events found for this {entityType}.
      </div>
    );
  }

  const Icon = eventIcons[entityType] || FileText;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Event History
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {/* Events */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              
              {/* Event content */}
              <div className="flex-1 bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventColor(event.eventType)}`}>
                        {formatEventType(event.eventType)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        v{event.metadata.version}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground mb-2">
                      {event.data.description || `Event ${event.eventType} occurred`}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{format(new Date(event.timestamp), 'PPp')}</span>
                      <span>•</span>
                      <span>User: {event.userId}</span>
                      {event.metadata.source && (
                        <>
                          <span>•</span>
                          <span>Source: {event.metadata.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Event number */}
                  <div className="text-xs text-muted-foreground">
                    #{events.length - index}
                  </div>
                </div>
                
                {/* Additional event data */}
                {Object.keys(event.data).length > 1 && (
                  <details className="mt-3">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      View event data
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
