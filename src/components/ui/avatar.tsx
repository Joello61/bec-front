import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { formatImageUrl } from '@/lib/utils/format';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
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
  // === Dimensions de l'avatar principal ===
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const sizePixels = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  // === Badge de statut ===
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    away: 'bg-warning',
    busy: 'bg-error',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  // === Badge vérifié (position + taille adaptatives) ===
  const verifiedBadge = {
    xs: { p: 'p-0', icon: 'w-2.5 h-2.5', offset: '-bottom-[1px] -right-[1px]' },
    sm: { p: 'p-0.5', icon: 'w-2.5 h-2.5', offset: '-bottom-[5px] -right-[4px]' },
    md: { p: 'p-0.5', icon: 'w-3.5 h-3.5', offset: '-bottom-[3px] -right-[3px]' },
    lg: { p: 'p-1', icon: 'w-4 h-4', offset: '-bottom-[4px] -right-[4px]' },
    xl: { p: 'p-1.5', icon: 'w-5 h-5', offset: '-bottom-[5px] -right-[5px]' },
  };

  const { p, icon, offset } = verifiedBadge[size];

  // === Initiales fallback ===
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const initials = fallback ? getInitials(fallback) : '?';
  const pixelSize = sizePixels[size];

  const formattedSrc = formatImageUrl(src);

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium overflow-hidden',
          sizes[size],
          !src && 'bg-primary text-white'
        )}
      >
        {formattedSrc ? (
          <Image
            src={formattedSrc}
            alt={alt}
            width={pixelSize}
            height={pixelSize}
            className="w-full h-full object-cover"
            unoptimized
          />
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
          className={cn(
            'absolute bg-info text-white rounded-full',
            p,
            offset,
            'border-2 border-white shadow-sm'
          )}
          aria-label="Compte vérifié"
        >
          <Check className={cn(icon)} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}
