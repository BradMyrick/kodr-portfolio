'use client';

import React, { useEffect } from 'react';
import { useUser, useIsAuthenticated } from '@/stores/useAppStore';
import { useProjectsHook } from '@/hooks/useProjects';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';

export default function DashboardPage() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { loadUserProjects } = useProjectsHook();

  // Load projects from API
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load user's projects using our new hook
      loadUserProjects({ limit: 50 });
    }
  }, [isAuthenticated, user, loadUserProjects]);

  return <DashboardWrapper />;
}
