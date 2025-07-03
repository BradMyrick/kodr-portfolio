'use client';

import React from 'react';
import { useUser, useAppStore } from '@/stores/useAppStore';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { generateId, formatRelativeTime } from '@/utils';

export default function TeamsPage() {
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

  // Mock team data
  const teams = [
    {
      id: '1',
      name: 'Product Development',
      description: 'Core product development team working on new features and improvements',
      members: [
        { user: user!, role: 'owner', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { user: { ...user!, id: '2', name: 'Sarah Chen', email: 'sarah@concordia.io' }, role: 'admin', joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
        { user: { ...user!, id: '3', name: 'Mike Johnson', email: 'mike@concordia.io' }, role: 'member', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { user: { ...user!, id: '4', name: 'Emma Davis', email: 'emma@concordia.io' }, role: 'member', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      projects: ['AI-Powered Chat App', 'Smart Home Dashboard'],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Design System',
      description: 'Maintaining and evolving our design system and component library',
      members: [
        { user: user!, role: 'admin', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { user: { ...user!, id: '5', name: 'Alex Rivera', email: 'alex@concordia.io' }, role: 'owner', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { user: { ...user!, id: '6', name: 'Lisa Park', email: 'lisa@concordia.io' }, role: 'member', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      projects: ['Component Library', 'Design Tokens'],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <Layout requireAuth showSidebar>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Teams
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your teams and collaborate with colleagues
            </p>
          </div>
          <Button onClick={() => handleComingSoon('Team Creation')}>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Team
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{teams.length}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teams.reduce((total, team) => total + team.members.length, 0)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teams.reduce((total, team) => total + team.projects.length, 0)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Team Size</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(teams.reduce((total, team) => total + team.members.length, 0) / teams.length)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id} hover className="cursor-pointer">
              <Card.Content className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {team.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {team.description}
                    </p>
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Members ({team.members.length})
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleComingSoon('Member Management')}
                    >
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 4).map((member, index) => (
                        <Avatar
                          key={index}
                          src={member.user.avatar}
                          name={member.user.name}
                          size="sm"
                          className="border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                    {team.members.length > 4 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{team.members.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Active Projects ({team.projects.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {team.projects.map((project) => (
                      <span
                        key={project}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Created {formatRelativeTime(team.createdAt)}</span>
                  <span>Updated {formatRelativeTime(team.updatedAt)}</span>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Card.Content className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Create New Team
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start collaborating with a new team
              </p>
              <Button onClick={() => handleComingSoon('Team Creation')}>
                Get Started
              </Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Invite Members
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add colleagues to your teams
              </p>
              <Button onClick={() => handleComingSoon('Member Invitations')}>
                Send Invites
              </Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Team Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Configure permissions and preferences
              </p>
              <Button onClick={() => handleComingSoon('Team Settings')}>
                Configure
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
