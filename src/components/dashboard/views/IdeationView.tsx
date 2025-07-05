'use client';

import React, { memo } from 'react';
import { useUser, useAppStore } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateId } from '@/utils';
import { DashboardViewProps } from '@/types/dashboard';

const IdeationView: React.FC<DashboardViewProps> = memo(() => {
  const user = useUser();
  const { addNotification } = useAppStore();

  const handleComingSoon = (feature: string) => {
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Feature Coming Soon',
      message: `${feature} will be available in the next release!`,
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  };

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ideation Room
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Collaborate, brainstorm, and bring your ideas to life with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Whiteboard Section */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <Card.Header>
                <Card.Title>Collaborative Whiteboard</Card.Title>
                <Card.Description>
                  Sketch, draw, and visualize your ideas in real-time
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Interactive Whiteboard</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Real-time collaborative drawing and diagramming
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => handleComingSoon('Interactive Whiteboard')}>
                        Open Whiteboard
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Ideas Collection */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <Card.Title>Idea Collection</Card.Title>
                    <Card.Description>
                      Capture and organize your team's creative insights
                    </Card.Description>
                  </div>
                  <Button onClick={() => handleComingSoon('Idea Creation')}>
                    Add Idea
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sample Ideas */}
                  {[
                    {
                      title: 'AI-Powered Code Review',
                      description: 'Integrate machine learning to automatically review code quality and suggest improvements',
                      votes: 8,
                      tags: ['AI', 'Development', 'Automation']
                    },
                    {
                      title: 'Real-time Collaboration Widget',
                      description: 'Create a floating widget that shows team members currently online and their activities',
                      votes: 12,
                      tags: ['UI/UX', 'Real-time', 'Collaboration']
                    }
                  ].map((idea, index) => (
                    <Card key={index} hover className="cursor-pointer">
                      <Card.Content className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {idea.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {idea.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {idea.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {idea.votes}
                            </span>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tools */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <Card.Header>
                <Card.Title>Quick Tools</Card.Title>
                <Card.Description>
                  Boost your creativity with these ideation helpers
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleComingSoon('Brainstorming Session')}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Brainstorming
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleComingSoon('Mind Mapping')}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Create Mind Map
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

IdeationView.displayName = 'IdeationView';

export default IdeationView;
