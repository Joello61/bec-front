import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  verified?: boolean;
}

export default function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  status,
  verified = false,
  className,
  ...props
}: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl'
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    away: 'bg-warning',
    busy: 'bg-error'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  // Générer les initiales depuis le fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = fallback ? getInitials(fallback) : '?';

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium overflow-hidden',
          sizes[size],
          !src && 'bg-primary text-white'
        )}
      >
        {src ? (
          <Image src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Badge de statut */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Statut: ${status}`}
        />
      )}

      {/* Badge vérifié */}
      {verified && (
        <span
          className="absolute -bottom-1 -right-1 bg-info text-white rounded-full p-0.5"
          aria-label="Compte vérifié"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
}