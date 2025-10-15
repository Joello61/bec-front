import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  hoverable?: boolean;
}

export function Card({ 
  className, 
  variant = 'default',
  hoverable = false,
  children,
  ...props 
}: CardProps) {
  const variants = {
    default: 'card',
    bordered: 'bg-white rounded-lg border-2 border-gray-200 p-6',
    elevated: 'bg-white rounded-lg shadow-lg p-6 border border-gray-100'
  };

  return (
    <div
      className={cn(
        variants[variant],
        hoverable && 'transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ 
  className, 
  title,
  description,
  action,
  children,
  ...props 
}: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
          {children}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}


export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div 
      className={cn('mt-4 pt-4 border-t border-gray-200 flex items-center justify-between', className)} 
      {...props}
    >
      {children}
    </div>
  );
}