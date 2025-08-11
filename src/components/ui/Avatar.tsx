import React, { useState } from 'react';
import Image from 'next/image';
import { cn, getInitials } from '@/utils';
import { BaseComponentProps } from '@/types';

interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackColor?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  fallbackColor,
  showOnlineStatus = false,
  isOnline = false,
  className,
  children,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const onlineStatusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Sanitize image URL to prevent XSS
  const sanitizedSrc = src && !imageError ? src.replace(/javascript:/gi, '') : undefined;
  
  const initials = name ? getInitials(name) : '';
  
  // Generate consistent color for user if no fallbackColor provided
  const getAvatarColor = () => {
    if (fallbackColor) return fallbackColor;
    
    if (!name) return '#6B7280'; // Default gray
    
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
      '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
      '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
      '#EC4899', '#F43F5E'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden',
          'bg-gray-100 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800',
          sizeClasses[size]
        )}
        style={{
          backgroundColor: !sanitizedSrc || imageError ? getAvatarColor() : undefined,
        }}
      >
        {sanitizedSrc && !imageError ? (
          <>
            <Image
              src={sanitizedSrc}
              alt={alt || name || 'Avatar'}
              fill
              className={cn(
                'object-cover transition-opacity duration-200',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-full w-full" />
              </div>
            )}
          </>
        ) : (
          <span className="font-medium text-white select-none">
            {children || initials}
          </span>
        )}
      </div>

      {/* Online status indicator */}
      {showOnlineStatus && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
            onlineStatusSizes[size],
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default Avatar;
