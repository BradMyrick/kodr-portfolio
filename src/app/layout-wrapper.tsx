'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, useTheme, useUser } from '@/stores/useAppStore';
import { ToastContainer } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/utils';

interface LayoutWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showSidebar?: boolean;
}

export default function LayoutWrapper({
  children,
  requireAuth = false,
  showSidebar = false,
}: LayoutWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle mounting first
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle store hydration after mounting
  useEffect(() => {
    if (!isMounted) return;
    
    const timeout = setTimeout(() => {
      try {
        useAppStore.persist.rehydrate();
        setIsHydrated(true);
      } catch (error) {
        console.error('Hydration error:', error);
        setIsHydrated(true); // Still show the UI even if hydration fails
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [isMounted]);
  
  // Get state only after hydration
  const theme = isHydrated ? useTheme() : 'light';
  const user = isHydrated ? useUser() : null;
  const notifications = isHydrated ? useAppStore((state) => state.notifications) : [];
  const removeNotification = useAppStore((state) => state.removeNotification);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render layout if auth is required but user is not authenticated
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
      theme === 'dark' ? 'dark' : ''
    )}>
      {/* Navigation */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && user && (
          <Sidebar />
        )}
        
        {/* Main Content */}
        <main className={cn(
          'flex-1 transition-all duration-200',
          showSidebar && user ? 'lg:ml-64' : ''
        )}>
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
