'use client';

import React, { useEffect } from 'react';
import { useUser, useProjects, useAppStore } from '@/stores/useAppStore';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { generateId, generateRandomColor } from '@/utils';
import { Project } from '@/types';

export default function DashboardPage() {
  const user = useUser();
  const projects = useProjects();
  const { setProjects } = useAppStore();

  // Initialize mock data
  useEffect(() => {
    if (user && projects.length === 0) {
      const mockProjects: Project[] = [
        {
          id: generateId(),
          title: 'AI-Powered Chat App',
          description: 'Building a revolutionary chat application with AI integration for better communication.',
          status: 'active',
          contributors: [user],
          owner: user,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          tags: ['AI', 'Chat', 'Mobile'],
          color: generateRandomColor(),
        },
        {
          id: generateId(),
          title: 'Smart Home Dashboard',
          description: 'Creating an intelligent dashboard for home automation and energy management.',
          status: 'active',
          contributors: [user],
          owner: user,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          tags: ['IoT', 'Dashboard', 'Smart Home'],
          color: generateRandomColor(),
        },
        {
          id: generateId(),
          title: 'E-commerce Analytics',
          description: 'Advanced analytics platform for e-commerce businesses to track performance.',
          status: 'completed',
          contributors: [user],
          owner: user,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['Analytics', 'E-commerce', 'Data'],
          color: generateRandomColor(),
        },
      ];
      setProjects(mockProjects);
    }
  }, [user, projects, setProjects]);

  return <DashboardWrapper />;
}
