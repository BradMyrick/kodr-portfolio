'use client';

import React from 'react';
import { useUser, useAppStore } from '@/stores/useAppStore';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AIAssistant from '@/components/ai/AIAssistant';
import { generateId } from '@/utils';

export default function IdeationPage() {
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

  if (!user) {
    return null;
  }

  return (
    <Layout requireAuth showSidebar>
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
            <Card>
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
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <Card.Title>Idea Collection</Card.Title>
                    <Card.Description>
                      Capture and organize your team&apos;s creative insights
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
                    },
                    {
                      title: 'Smart Project Templates',
                      description: 'Generate project templates based on industry best practices and user preferences',
                      votes: 6,
                      tags: ['Templates', 'AI', 'Productivity']
                    },
                    {
                      title: 'Voice-to-Text Meeting Notes',
                      description: 'Convert meeting discussions into structured notes and action items automatically',
                      votes: 15,
                      tags: ['AI', 'Meetings', 'Documentation']
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

            {/* Idea Clustering */}
            <Card>
              <Card.Header>
                <Card.Title>AI-Powered Idea Clustering</Card.Title>
                <Card.Description>
                  Automatically group related ideas to identify patterns and themes
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Smart Idea Organization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Our AI analyzes your ideas and groups them by themes, helping you identify the most promising concepts
                    </p>
                    <Button onClick={() => handleComingSoon('AI Idea Clustering')}>
                      Generate Clusters
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <AIAssistant compact />
            
            {/* Quick Tools */}
            <Card>
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
                    onClick={() => handleComingSoon('Random Idea Generator')}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Random Idea Generator
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleComingSoon('SCAMPER Method')}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 01-2 2m-3 7h3m-3 4h3m6-4h.01M21 16h.01" />
                    </svg>
                    SCAMPER Method
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleComingSoon('Mind Mapping')}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mind Mapping
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleComingSoon('Voting Session')}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Start Voting Session
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* Session Info */}
            <Card>
              <Card.Header>
                <Card.Title>Session Stats</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ideas Generated</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Participants</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Session Duration</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">1h 23m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Top Voted Idea</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Voice Notes</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
