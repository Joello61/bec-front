'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils/cn';

interface DropdownContextType {
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
};

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 150); 
  };

  const openDropdown = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDropdown();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <DropdownContext.Provider value={{ closeDropdown }}>
      <div ref={dropdownRef} className={cn('relative', className)}>
        <div 
          onClick={() => isOpen ? closeDropdown() : openDropdown()} 
          className="cursor-pointer"
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            className={cn(
              'absolute top-full mt-2 z-50 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 py-1',
              'transition-all duration-150 ease-out',
              alignments[align],
              isAnimating 
                ? 'opacity-0 scale-95 translate-y-[-8px]' 
                : 'opacity-100 scale-100 translate-y-0'
            )}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  closeOnClick?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger = false,
  disabled = false,
  className,
  closeOnClick = true
}: DropdownItemProps) {
  const { closeDropdown } = useDropdown();

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      if (closeOnClick) {
        closeDropdown();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-2 text-left flex items-center gap-3 transition-colors duration-150',
        'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:bg-gray-100',
        danger ? 'text-error hover:bg-error/10 focus:bg-error/10' : 'text-gray-700',
        className
      )}
    >
      {icon && (
        <span className={cn(
          'transition-colors duration-150',
          danger ? 'text-error' : 'text-gray-400'
        )}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-gray-200" />;
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </div>
  );
}