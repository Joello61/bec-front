'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  debounceMs?: number;
}

export default function SearchBar({ 
  placeholder = 'Rechercher...', 
  onSearch,
  defaultValue = '',
  debounceMs = 300 
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="w-5 h-5" />}
        rightIcon={
          query && (
            <button
              onClick={handleClear}
              className="hover:bg-gray-100 rounded p-1 transition-colors"
              aria-label="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          )
        }
      />
    </div>
  );
}