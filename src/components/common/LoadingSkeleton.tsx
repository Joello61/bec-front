'use client';

import { cn } from '@/lib/utils/cn';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export default function LoadingSkeleton({ 
  variant = 'text',
  width,
  height,
  className,
  count = 1 
}: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const skeleton = (
    <div
      className={cn(
        'bg-gray-200 animate-pulse',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );

  if (count === 1) {
    return skeleton;
  }

  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i}>{skeleton}</div>
      ))}
    </div>
  );
}

// Composants pré-configurés pour usage courant
export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="circular" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton width="60%" />
          <LoadingSkeleton width="40%" />
        </div>
      </div>
      <LoadingSkeleton count={3} />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}