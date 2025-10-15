import { useState, useRef, useEffect, forwardRef } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
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
  searchable?: boolean;
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
      searchable = true,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
      if (!isOpen) {
        setSearchQuery('');
      }
    }, [isOpen, searchable]);

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
      setSearchQuery('');
      onBlur?.();
    };

    const filteredOptions = searchable && searchQuery
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

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
            {required && <span className="text-red-500 ml-1">*</span>}
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
              'w-full h-11 px-4 rounded-lg border transition-all duration-200',
              'flex items-center justify-between',
              'bg-white text-sm',
              'cursor-pointer text-left',
              'hover:border-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50',
              leftIcon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
              !error && 'border-gray-300',
              !selectedValue && 'text-gray-400',
              className
            )}
          >
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {leftIcon}
              </div>
            )}

            <span className={cn('block truncate', leftIcon && 'ml-2')}>
              {displayText}
            </span>

            <ChevronDown
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 pointer-events-none',
                error ? 'text-red-500' : 'text-gray-400',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>

          <input type="hidden" name={name} value={selectedValue} />

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-60 overflow-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    Aucun résultat trouvé
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = option.value === selectedValue;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={option.disabled}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        className={cn(
                          'w-full px-4 py-2.5 text-left flex items-center justify-between text-sm',
                          'transition-colors duration-150',
                          'hover:bg-primary/20',
                          'focus:bg-primary/20 focus:outline-none',
                          isSelected && 'bg-primary/20 text-primary font-medium',
                          option.disabled && 'opacity-50 cursor-not-allowed hover:bg-white'
                        )}
                      >
                        <span className="block truncate">{option.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;