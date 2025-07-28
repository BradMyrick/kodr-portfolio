'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useProjects, useAppStore } from '@/stores/useAppStore';
import { ToastContainer } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import DashboardHome from './views/DashboardHome';
import ProjectsView from './views/ProjectsView';
import IdeationView from './views/IdeationView';
import TeamsView from './views/TeamsView';
import ResourcesView from './views/ResourcesView';
import SettingsView from './views/SettingsView';
import NotificationsView from './views/NotificationsView';
import MessagingView from './views/MessagingView';
import DashboardNavigation from './DashboardNavigation';
import { DashboardView, NavigationItem } from '@/types/dashboard';

const DashboardWrapper: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const user = useUser();
  const projects = useProjects();
  const { notifications, removeNotification } = useAppStore();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect to login if not authenticated after hydration
  useEffect(() => {
    if (isHydrated && !user) {
      router.push('/auth/login');
    }
  }, [isHydrated, user, router]);

  // Memoized navigation items to prevent unnecessary re-renders
  const navigationItems: NavigationItem[] = useMemo(() => [
    {
      id: 'home',
      label: 'Dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: projects.filter(p => p.status === 'active').length,
    },
    {
      id: 'ideation',
      label: 'Ideation Room',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'resources',
      label: 'Resource Hub',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-10-5a7 7 0 1114 0v2.5l2 2V20h-20v-3.5l2-2V12z" />
        </svg>
      ),
      badge: notifications.filter(n => !n.read).length,
    },
    {
      id: 'messaging',
      label: 'Messaging',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ], [projects, notifications]);

  // Optimized view switching with smooth transitions
  const handleViewChange = useCallback((view: DashboardView) => {
    if (view === activeView) return;
    
    setIsTransitioning(true);
    
    // Use a minimal timeout for smooth transition
    setTimeout(() => {
      setActiveView(view);
      setIsTransitioning(false);
    }, 150);
  }, [activeView]);

  // Memoized content renderer to prevent unnecessary re-renders
  const renderContent = useMemo(() => {
    const contentProps = { 
      isTransitioning,
      onViewChange: handleViewChange 
    };

    switch (activeView) {
      case 'home':
        return <DashboardHome {...contentProps} />;
      case 'projects':
        return <ProjectsView {...contentProps} />;
      case 'ideation':
        return <IdeationView {...contentProps} />;
      case 'teams':
        return <TeamsView {...contentProps} />;
      case 'resources':
        return <ResourcesView {...contentProps} />;
      case 'notifications':
        return <NotificationsView {...contentProps} />;
      case 'messaging':
        return <MessagingView {...contentProps} />;
      case 'settings':
        return <SettingsView {...contentProps} />;
      default:
        return <DashboardHome {...contentProps} />;
    }
  }, [activeView, isTransitioning, handleViewChange]);

  // Show loading if not hydrated yet or if user is not available
  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <Navbar />
      
      <div className="flex" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Dashboard Navigation */}
        <DashboardNavigation
          items={navigationItems}
          activeView={activeView}
          onViewChange={handleViewChange}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className={`h-full transition-opacity duration-150 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
            {renderContent}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default DashboardWrapper;
