'use client';

import React, { memo } from 'react';
import { cn } from '@/utils';
import { DashboardView, NavigationItem } from '@/src/types/dashboard';

interface DashboardNavigationProps {
  items: NavigationItem[];
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}

const DashboardNavigationItem = memo<NavigationItemProps>(({ item, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out',
        'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.02]',
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
      )}
    >
      <div className="flex items-center space-x-3">
        <span className={cn(
          'flex-shrink-0 transition-colors duration-200',
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
        )}>
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </div>
      
      {item.badge && item.badge > 0 && (
        <span className={cn(
          'inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full transition-all duration-200',
          isActive
            ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        )}>
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </button>
  );
});

DashboardNavigationItem.displayName = 'DashboardNavigationItem';

const DashboardNavigation: React.FC<DashboardNavigationProps> = memo(({
  items,
  activeView,
  onViewChange,
}) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Innovation Hub
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Dashboard Control Center
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <DashboardNavigationItem
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>All systems operational</span>
        </div>
      </div>
    </aside>
  );
});

DashboardNavigation.displayName = 'DashboardNavigation';

export default DashboardNavigation;
