import React from 'react';

export type DashboardView = 
  | 'home'
  | 'projects'
  | 'ideation'
  | 'teams'
  | 'resources'
  | 'notifications'
  | 'settings'
  | 'messaging';

export interface NavigationItem {
  id: DashboardView;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface DashboardViewProps {
  isTransitioning?: boolean;
  onViewChange?: (view: DashboardView) => void;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  teamMembers: number;
  ideas: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
  variant?: 'primary' | 'secondary' | 'outline';
}
