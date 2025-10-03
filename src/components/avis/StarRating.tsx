'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => interactive && onChange?.(starValue)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'hover:scale-110 cursor-pointer',
              !interactive && 'cursor-default'
            )}
            aria-label={`${starValue} étoile${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizes[size],
                isFilled ? 'fill-warning text-warning' : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}