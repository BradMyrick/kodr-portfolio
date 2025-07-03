'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const settings = [
    {
      title: 'Profile Settings',
      description: 'Update your personal information and change your password.',
      icon: '👤',
      color: 'from-blue-500 to-teal-500'
    },
    {
      title: 'Notification Preferences',
      description: 'Manage how and when you receive notifications.',
      icon: '🔔',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Security Settings',
      description: 'Enhance your account security with 2FA and security questions.',
      icon: '🔒',
      color: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <Layout requireAuth showSidebar>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your experience and manage your account settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.map((setting, i) => (
            <Card 
              key={i} 
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              onClick={() => alert(`${setting.title} is coming soon!`)}
            >
              <Card.Content className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${setting.color} rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg`}>
                  {setting.icon}
                </div>
                <Card.Title className="mb-3 text-lg font-bold">
                  {setting.title}
                </Card.Title>
                <Card.Description className="text-sm leading-relaxed">
                  {setting.description}
                </Card.Description>
                <Button size="sm" variant="ghost">
                  Edit →
                </Button>
              </Card.Content>
            </Card>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ✨ More Settings Coming Soon
          </h3>
          <p className="text-purple-100 mb-6">
            We're enhancing our settings options. Stay tuned for more updates.
          </p>
        </div>
      </div>
    </Layout>
  );
}
