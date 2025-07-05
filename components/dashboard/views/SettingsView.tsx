'use client';

import React, { memo } from 'react';
import { useUser, useTheme, useAppStore } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { generateId } from '@/utils';
import { DashboardViewProps } from '@/src/types/dashboard';

const SettingsView: React.FC<DashboardViewProps> = memo(() => {
  const user = useUser();
  const theme = useTheme();
  const { setTheme, addNotification } = useAppStore();

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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    addNotification({
      id: generateId(),
      type: 'success',
      title: 'Theme Changed',
      message: `Switched to ${newTheme} theme successfully!`,
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  };

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account and application preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <Card.Header>
              <Card.Title>Profile Settings</Card.Title>
              <Card.Description>
                Update your personal information and profile details
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => handleComingSoon('Profile Editing')}>
                  Update Profile
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <Card.Header>
              <Card.Title>Appearance</Card.Title>
              <Card.Description>
                Customize the look and feel of your dashboard
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="flex space-x-4">
                    <Button
                      variant={theme === 'light' ? 'primary' : 'outline'}
                      onClick={() => handleThemeChange('light')}
                      className="flex items-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'primary' : 'outline'}
                      onClick={() => handleThemeChange('dark')}
                      className="flex items-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>Dark</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Notification Settings */}
          <Card>
            <Card.Header>
              <Card.Title>Notifications</Card.Title>
              <Card.Description>
                Control how and when you receive notifications
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComingSoon('Email Notification Settings')}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in your browser</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComingSoon('Push Notification Settings')}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <Card.Header>
              <Card.Title>Privacy & Security</Card.Title>
              <Card.Description>
                Manage your privacy settings and account security
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => handleComingSoon('Password Change')}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleComingSoon('Two-Factor Authentication')}
                >
                  Enable Two-Factor Authentication
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleComingSoon('Data Export')}
                >
                  Export My Data
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <Card.Header>
              <Card.Title className="text-red-600 dark:text-red-400">Danger Zone</Card.Title>
              <Card.Description>
                Irreversible and destructive actions
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => handleComingSoon('Account Deletion')}
              >
                Delete Account
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
});

SettingsView.displayName = 'SettingsView';

export default SettingsView;
