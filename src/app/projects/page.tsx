'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useProjects, useAppStore } from '@/stores/useAppStore';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/ui/Modal';
import KanbanBoard from '@/components/project/KanbanBoard';
import { formatRelativeTime, generateId } from '@/utils';
import { Project, Task, User } from '@/types';

export default function ProjectsPage() {
  const user = useUser();
  const projects = useProjects();
  const { setCurrentProject, addNotification } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Mock tasks for the selected project
  useEffect(() => {
    if (selectedProject) {
      const mockTasks: Task[] = [
        {
          id: generateId(),
          title: 'Design user interface',
          description: 'Create wireframes and mockups for the main dashboard',
          status: 'in-progress',
          priority: 'high',
          assignee: user || undefined,
          projectId: selectedProject.id,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: generateId(),
          title: 'Set up development environment',
          description: 'Configure tools and dependencies',
          status: 'done',
          priority: 'medium',
          assignee: user || undefined,
          projectId: selectedProject.id,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: generateId(),
          title: 'Research competitors',
          description: 'Analyze similar products in the market',
          status: 'todo',
          priority: 'low',
          projectId: selectedProject.id,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setTasks(mockTasks);
    }
  }, [selectedProject, user]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentProject(project);
    setIsKanbanOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));

    addNotification({
      id: generateId(),
      type: 'success',
      title: 'Task Updated',
      message: 'Task has been successfully updated.',
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  };

  const handleTaskCreate = () => {
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Task creation will be available soon!',
      read: false,
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
    });
  };

  const handleCreateProject = () => {
    addNotification({
      id: generateId(),
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Project creation will be available soon!',
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Hold</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projects.filter(p => p.status === 'on_hold').length}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="cursor-pointer" onClick={() => handleProjectSelect(project)}>
              <Card hover>
              <Card.Content className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : project.status === 'on_hold'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
                      {project.members.slice(0, 3).map((member, index) => (
                        <div
                          key={member.userId || index}
                          className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300"
                          title={`Member (${member.role})`}
                        >
                          {member.userId.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(project.updatedAt)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </Card.Content>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new project.
            </p>
            <div className="mt-6">
              <Button onClick={handleCreateProject}>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </Button>
            </div>
          </div>
        )}

        {/* Kanban Modal */}
        <Modal
          isOpen={isKanbanOpen}
          onClose={() => setIsKanbanOpen(false)}
          title={selectedProject?.name}
          size="xl"
        >
          {selectedProject && (
            <div className="h-96">
              <KanbanBoard
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskCreate={handleTaskCreate}
                users={[]} // TODO: Convert project members to User[] format
              />
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
