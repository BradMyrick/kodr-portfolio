'use client';

import React from 'react';
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
  return (
    <LayoutWrapper requireAuth={requireAuth} showSidebar={showSidebar}>
      {children}
    </LayoutWrapper>
  );
};

export default Layout;
