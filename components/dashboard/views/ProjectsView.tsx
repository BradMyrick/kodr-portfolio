'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';
import { useUser, useProjects, useAppStore } from '@/stores/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { formatRelativeTime, generateId } from '@/utils';
import { DashboardViewProps } from '@/src/types/dashboard';
import { Project } from '@/types';

interface FilterState {
  status: 'all' | 'active' | 'completed' | 'on-hold';
  search: string;
}

interface ProjectGridItemProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectGridItem = memo<ProjectGridItemProps>(({ project, onClick }) => (
  <div 
    className="cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
    onClick={() => onClick(project)}
  >
    <Card hover>
      <Card.Content className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {project.title}
          </h3>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          project.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : project.status === 'completed'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : project.status === 'on-hold'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project.contributors.slice(0, 3).map((contributor) => (
              <Avatar
                key={contributor.id}
                src={contributor.avatar}
                name={contributor.name}
                size="sm"
                className="border-2 border-white dark:border-gray-800"
              />
            ))}
          </div>
          {project.contributors.length > 3 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              +{project.contributors.length - 3}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatRelativeTime(project.updatedAt)}
        </span>
      </div>
      
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>
      )}
      </Card.Content>
    </Card>
  </div>
));

ProjectGridItem.displayName = 'ProjectGridItem';

const ProjectsView: React.FC<DashboardViewProps> = memo(() => {
  const user = useUser();
  const projects = useProjects();
  const { addNotification } = useAppStore();
  
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    search: '',
  });

  // Optimized project filtering with memoization
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesSearch = filters.search === '' || 
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  }, [projects, filters]);

  // Memoized stats
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length,
  }), [projects]);

  const handleCreateProject = useCallback(() => {
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Project creation will be available soon!',
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  }, [addNotification, user?.id]);

  const handleProjectClick = useCallback((project: Project) => {
    // In a real app, this would navigate to project details
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Project Details',
      message: `Opening ${project.title} project details...`,
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  }, [addNotification, user?.id]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and collaborate on your projects
            </p>
          </div>
          <Button onClick={handleCreateProject}>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200">
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Hold</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.onHold}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Content className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectGridItem
                key={project.id}
                project={project}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        ) : (
          <Card>
            <Card.Content className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filters.search || filters.status !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by creating your first project.'
                }
              </p>
              {(!filters.search && filters.status === 'all') && (
                <Button onClick={handleCreateProject}>
                  Create Your First Project
                </Button>
              )}
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
});

ProjectsView.displayName = 'ProjectsView';

export default ProjectsView;
