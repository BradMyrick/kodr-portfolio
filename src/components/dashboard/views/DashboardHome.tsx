'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { useUser, useProjects, useAppStore } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { formatRelativeTime, generateId } from '@/utils';
import { DashboardViewProps, DashboardStats, QuickAction } from '@/types/dashboard';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = memo<StatCardProps>(({ title, value, icon, color, trend }) => (
  <Card className="hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
    <Card.Content className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="mr-1">
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </Card.Content>
  </Card>
));

StatCard.displayName = 'StatCard';

interface ProjectCardProps {
  project: any;
  onClick?: () => void;
}

const ProjectCard = memo<ProjectCardProps>(({ project, onClick }) => (
  <Card 
    hover 
    className="cursor-pointer transition-all duration-200 transform hover:scale-[1.01]"
    onClick={onClick}
  >
    <Card.Content className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              project.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : project.status === 'completed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {project.contributors.slice(0, 3).map((contributor: any) => (
                  <Avatar
                    key={contributor.id}
                    src={contributor.avatar}
                    name={contributor.name}
                    size="sm"
                    className="border-2 border-white dark:border-gray-800"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {project.contributors.length} member{project.contributors.length !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Updated {formatRelativeTime(project.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card>
));

ProjectCard.displayName = 'ProjectCard';

const DashboardHome: React.FC<DashboardViewProps> = memo(({ onViewChange }) => {
  const user = useUser();
  const projects = useProjects();
  const { addNotification } = useAppStore();

  // Memoized stats calculation
  const stats: DashboardStats = useMemo(() => ({
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    teamMembers: 5, // This could come from actual team data
    ideas: 23, // This could come from actual ideas data
    completedTasks: 47,
    pendingTasks: 12,
  }), [projects]);

  // Memoized recent projects
  const recentProjects = useMemo(() => 
    projects.slice(0, 3), 
    [projects]
  );

  // Optimized notification handler
  const handleComingSoon = useCallback((feature: string) => {
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Feature Coming Soon',
      message: `${feature} will be available soon!`,
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  }, [addNotification, user?.id]);

  // Memoized quick actions
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'new-project',
      label: 'Create New Project',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => handleComingSoon('Project Creation'),
      variant: 'primary' as const,
    },
    {
      id: 'ideation-room',
      label: 'Open Ideation Room',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      onClick: () => onViewChange?.('ideation'),
      variant: 'outline' as const,
    },
    {
      id: 'view-teams',
      label: 'Manage Teams',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => onViewChange?.('teams'),
      variant: 'outline' as const,
    },
  ], [handleComingSoon, onViewChange]);

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your projects and team.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            color="bg-blue-100 dark:bg-blue-900"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="bg-green-100 dark:bg-green-900"
            trend={{ value: 5, isPositive: true }}
          />
          
          <StatCard
            title="Team Members"
            value={stats.teamMembers}
            icon={
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="bg-purple-100 dark:bg-purple-900"
          />
          
          <StatCard
            title="Ideas"
            value={stats.ideas}
            icon={
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            color="bg-orange-100 dark:bg-orange-900"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
              <Button 
                onClick={() => onViewChange?.('projects')} 
                size="sm"
                variant="outline"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onViewChange?.('projects')}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
                <Card.Description>
                  Get started with common tasks
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Button 
                      key={action.id}
                      variant={action.variant}
                      className="w-full justify-start"
                      onClick={action.onClick}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Activity Feed */}
            <Card>
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Description>
                  Latest updates from your team
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {[
                    {
                      user: 'Sarah Chen',
                      action: 'completed task "Design wireframes"',
                      time: '2 hours ago',
                      avatar: user.avatar,
                    },
                    {
                      user: 'Mike Johnson',
                      action: 'created new project "Mobile App"',
                      time: '4 hours ago',
                      avatar: user.avatar,
                    },
                    {
                      user: 'Emma Davis',
                      action: 'added 3 new ideas to ideation room',
                      time: '6 hours ago',
                      avatar: user.avatar,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Avatar
                        src={activity.avatar}
                        name={activity.user}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardHome.displayName = 'DashboardHome';

export default DashboardHome;
