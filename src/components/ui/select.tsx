import { useState, useRef, useEffect, forwardRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      options,
      value,
      onChange,
      onBlur,
      name,
      id,
      required,
      disabled,
      placeholder = 'Sélectionner...',
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          onBlur?.();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onBlur]);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
      onBlur?.();
    };

    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const displayText = selectedOption?.label || placeholder;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div ref={containerRef} className="relative">
          <button
            ref={ref}
            type="button"
            id={inputId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'input',
              'w-full',
              'flex items-center justify-between',
              'bg-white',
              'cursor-pointer',
              'text-left',
              'pr-10',
              leftIcon && 'pl-10',
              error && 'border-error focus:ring-error',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
              !selectedValue && 'text-gray-400',
              className
            )}
          >
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {leftIcon}
              </div>
            )}

            <span className={cn('block truncate', leftIcon && 'ml-7')}>
              {displayText}
            </span>

            <ChevronDown
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none',
                error ? 'text-error' : 'text-gray-400',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>

          {/* Hidden input for form submission */}
          <input type="hidden" name={name} value={selectedValue} />

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    className={cn(
                      'w-full px-4 py-3 text-left flex items-center justify-between',
                      'transition-colors',
                      'hover:bg-gray-50',
                      'focus:bg-gray-50 focus:outline-none',
                      isSelected && 'bg-primary/15 text-primary font-medium',
                      option.disabled && 'opacity-50 cursor-not-allowed hover:bg-white',
                      'first:rounded-t-lg last:rounded-b-lg'
                    )}
                  >
                    <span className="block truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-error">{error}</p>}

        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;