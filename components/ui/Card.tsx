import React from 'react';
import { cn } from '@/utils';
import { BaseComponentProps } from '@/types';

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<BaseComponentProps>;
  Title: React.FC<BaseComponentProps>;
  Description: React.FC<BaseComponentProps>;
  Content: React.FC<BaseComponentProps>;
  Footer: React.FC<BaseComponentProps>;
}

const Card: CardComponent = ({
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  ...props
}) => {
  const baseStyles = `
    rounded-lg transition-all duration-200 ease-in-out
  `;

  const variants = {
    default: `
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
    `,
    outlined: `
      bg-transparent border-2 border-gray-300 dark:border-gray-600
    `,
    elevated: `
      bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700
    `,
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddingClasses[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<BaseComponentProps> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<BaseComponentProps> = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100', className)} {...props}>
    {children}
  </h3>
);

const CardDescription: React.FC<BaseComponentProps> = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)} {...props}>
    {children}
  </p>
);

const CardContent: React.FC<BaseComponentProps> = ({ className, children, ...props }) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

const CardFooter: React.FC<BaseComponentProps> = ({ className, children, ...props }) => (
  <div className={cn('flex items-center pt-4', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
