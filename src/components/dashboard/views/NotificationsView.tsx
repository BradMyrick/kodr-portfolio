'use client';

import React, { memo } from 'react';
import { useUser, useNotifications, useAppStore } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils';
import { DashboardViewProps } from '@/types/dashboard';

const NotificationsView: React.FC<DashboardViewProps> = memo(() => {
  const user = useUser();
  const notifications = useNotifications();
  const { markNotificationAsRead, removeNotification } = useAppStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Stay updated with your latest activities
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline"
              onClick={() => {
                notifications.filter(n => !n.read).forEach(n => markNotificationAsRead(n.id));
              }}
            >
              Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 ${
                  !notification.read ? 'border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <Card.Content className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1 rounded-full ${
                          notification.type === 'success' ? 'bg-green-100 dark:bg-green-900' :
                          notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                          notification.type === 'error' ? 'bg-red-100 dark:bg-red-900' :
                          'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {notification.type === 'success' && (
                            <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {notification.type === 'warning' && (
                            <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          )}
                          {notification.type === 'error' && (
                            <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          {notification.type === 'info' && (
                            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card>
              <Card.Content className="p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zm-10-5a7 7 0 1114 0v2.5l2 2V20h-20v-3.5l2-2V12z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You're all caught up! New notifications will appear here.
                </p>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
});

NotificationsView.displayName = 'NotificationsView';

export default NotificationsView;
