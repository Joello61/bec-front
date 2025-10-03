'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { TOUTES_VILLES, DEMANDE_STATUTS } from '@/lib/utils/constants';
import type { DemandeFilters as DemandeFiltersType } from '@/types';

interface DemandeFiltersProps {
  onFilterChange: (filters: DemandeFiltersType) => void;
  initialFilters?: DemandeFiltersType;
}

export default function DemandeFilters({ onFilterChange, initialFilters = {} }: DemandeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<DemandeFiltersType>(initialFilters);

  const handleFilterChange = (key: keyof DemandeFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          leftIcon={<Filter className="w-4 h-4" />}
        >
          Filtres
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-error transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Effacer tout
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="card p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ville de départ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville de départ
                  </label>
                  <select
                    value={filters.villeDepart || ''}
                    onChange={(e) => handleFilterChange('villeDepart', e.target.value)}
                    className="input"
                  >
                    <option value="">Toutes les villes</option>
                    {TOUTES_VILLES.map((ville) => (
                      <option key={ville} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ville d'arrivée */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville d&apos;arrivée
                  </label>
                  <select
                    value={filters.villeArrivee || ''}
                    onChange={(e) => handleFilterChange('villeArrivee', e.target.value)}
                    className="input"
                  >
                    <option value="">Toutes les villes</option>
                    {TOUTES_VILLES.map((ville) => (
                      <option key={ville} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={filters.statut || ''}
                    onChange={(e) => handleFilterChange('statut', e.target.value)}
                    className="input"
                  >
                    <option value="">Tous les statuts</option>
                    {DEMANDE_STATUTS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}