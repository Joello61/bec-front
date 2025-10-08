'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({ 
  isFavorite, 
  onToggle, 
  size = 'md',
  className 
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'rounded-full flex items-center justify-center transition-colors',
        isFavorite 
          ? 'bg-primary/10 hover:bg-primary/20' 
          : 'bg-white/90 hover:bg-white border border-gray-200',
        sizes[size],
        isLoading && 'opacity-50 cursor-wait',
        className
      )}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <motion.div
        initial={false}
        animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            iconSizes[size],
            'transition-colors',
            isFavorite ? 'fill-primary text-primary' : 'text-gray-600'
          )}
        />
      </motion.div>
    </motion.button>
  );
}