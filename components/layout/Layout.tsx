'use client';

import React, { useEffect } from 'react';
import LayoutWrapper from '@/src/app/layout-wrapper';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  requireAuth = false,
  showSidebar = false,
}) => {

  // Check authentication client-side
  useEffect(() => {
    if (requireAuth) {
      // Client-side authentication check will be handled by LayoutWrapper
      // This is just for additional routing logic if needed
    }
  }, [requireAuth]);

  return (
    <LayoutWrapper requireAuth={requireAuth} showSidebar={showSidebar}>
      {children}
    </LayoutWrapper>
  );
};

export default Layout;
