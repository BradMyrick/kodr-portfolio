'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { useNotifications, useAppStore } from '@/stores/useAppStore';
import { formatRelativeTime } from '@/utils';

export default function NotificationsPage() {
  const notifications = useNotifications();
  const { markNotificationAsRead, removeNotification } = useAppStore();

  const mockNotifications = [
    {
      id: '1',
      type: 'info' as const,
      title: 'Welcome to Kodr.pro!',
      message: 'Your account has been successfully created. Start exploring the platform.',
      read: false,
      userId: 'demo',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Project Created',
      message: 'Your new project "AI Chat App" has been successfully created.',
      read: false,
      userId: 'demo',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Smart Contract Pending',
      message: 'Your collaboration agreement is waiting for signatures from 2 team members.',
      read: true,
      userId: 'demo',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: '4',
      type: 'info' as const,
      title: 'New Feature Available',
      message: 'Real-time collaboration tools are now available in your dashboard.',
      read: true,
      userId: 'demo',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  ];

  const allNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: '✅', color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' };
      case 'warning':
        return { icon: '⚠️', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' };
      case 'error':
        return { icon: '❌', color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' };
      default:
        return { icon: 'ℹ️', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' };
    }
  };

  return (
    <Layout requireAuth showSidebar>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with your projects and team activities
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              allNotifications.forEach(n => {
                if (!n.read) markNotificationAsRead(n.id);
              });
            }}
          >
            Mark All Read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {allNotifications.length === 0 ? (
            <Card>
              <Card.Content className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔔</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You'll see notifications about your projects and team activities here.
                </p>
              </Card.Content>
            </Card>
          ) : (
            allNotifications.map((notification) => {
              const { icon, color } = getNotificationIcon(notification.type);
              
              return (
                <Card 
                  key={notification.id}
                  className={`hover:shadow-lg transition-all duration-200 ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <Card.Content className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-sm">{icon}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              );
            })
          )}
        </div>

        {/* Notification Settings */}
        <Card className="mt-8">
          <Card.Header>
            <Card.Title>Notification Settings</Card.Title>
            <Card.Description>
              Customize how you receive notifications
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {[
                { label: 'Email notifications for project updates', checked: true },
                { label: 'Push notifications for smart contract events', checked: true },
                { label: 'Weekly digest of team activity', checked: false },
                { label: 'Marketing and feature announcements', checked: false },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={setting.checked}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </Layout>
  );
}
