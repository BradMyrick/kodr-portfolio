'use client';

import React, { memo } from 'react';
import { useUser, useAppStore } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateId } from '@/utils';
import { DashboardViewProps } from '@/types/dashboard';

const ResourcesView: React.FC<DashboardViewProps> = memo(() => {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resource Hub
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Access documentation, templates, and learning materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="cursor-pointer transition-all duration-200 transform hover:scale-[1.02]">
            <Card hover>
              <Card.Content className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Documentation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive guides and API references
              </p>
              <Button onClick={() => handleComingSoon('Documentation')} variant="outline">
                Browse Docs
              </Button>
              </Card.Content>
            </Card>
          </div>

          <div className="cursor-pointer transition-all duration-200 transform hover:scale-[1.02]">
            <Card hover>
              <Card.Content className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Templates</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ready-to-use project templates and boilerplates
              </p>
              <Button onClick={() => handleComingSoon('Templates')} variant="outline">
                View Templates
              </Button>
              </Card.Content>
            </Card>
          </div>

          <div className="cursor-pointer transition-all duration-200 transform hover:scale-[1.02]">
            <Card hover>
              <Card.Content className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Learning</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tutorials, courses, and best practices
              </p>
              <Button onClick={() => handleComingSoon('Learning Materials')} variant="outline">
                Start Learning
              </Button>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

ResourcesView.displayName = 'ResourcesView';

export default ResourcesView;
