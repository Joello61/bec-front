'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import Avatar, { AvatarProps } from './avatar';
import { Camera, Info } from 'lucide-react';

export interface AvatarWithButtonProps extends AvatarProps {
  buttonType?: 'camera' | 'info';
  onButtonClick?: () => void;
}

export default function AvatarWithButton({
  buttonType = 'camera',
  onButtonClick,
  className,
  ...avatarProps
}: AvatarWithButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const size = avatarProps.size ?? 'md';

  const buttonSizes = {
    xs: { icon: 'w-3 h-3', button: 'p-0.5' },
    sm: { icon: 'w-3.5 h-3.5', button: 'p-1' },
    md: { icon: 'w-3.5 h-3.5', button: 'p-1' },
    lg: { icon: 'w-4 h-4', button: 'p-1' },
    xl: { icon: 'w-5 h-5', button: 'p-2' },
  };

  const buttonOffsets = {
    xs: 'bottom-0 right-0',
    sm: 'bottom-[-3px] right-[-7px]',
    md: 'bottom-1 right-1',
    lg: 'bottom-0 right-0',
    xl: 'bottom-2 right-2',
  };

  const { icon, button } = buttonSizes[size];
  const offsetSizes = buttonOffsets;

  const buttonIcon = buttonType === 'camera'
    ? <Camera className={cn(icon)} strokeWidth={2}/>
    : <Info className={cn(icon)} strokeWidth={2}/>;

  const buttonTitle = buttonType === 'camera' ? 'Modifier la photo' : 'Voir le profil';

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar {...avatarProps} />

        {buttonType === 'camera' && isHovered && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity">
            <svg className={cn(icon, 'text-white')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}

        <button
          onClick={onButtonClick}
          className={cn(
            'absolute rounded-full shadow-lg transition-colors',
            button,
            offsetSizes[size],
            buttonType === 'camera'
              ? 'bg-primary hover:bg-primary-dark text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
          title={buttonTitle}
          aria-label={buttonTitle}
        >
          {buttonIcon}
        </button>
      </div>
    </div>
  );
}
