'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button, Select } from '@/components/ui';
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
            className=""
          >
            <div className="card p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ville de départ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville de départ
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Toutes les villes' },
                      ...TOUTES_VILLES.map((ville) => ({
                        value: ville,
                        label: ville
                      }))
                    ]}
                    value={filters.villeDepart || ''}
                    onChange={(value) => handleFilterChange('villeDepart', value)}
                    searchable={true}
                  />
                </div>

                {/* Ville d'arrivée */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville d&apos;arrivée
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Toutes les villes' },
                      ...TOUTES_VILLES.map((ville) => ({
                        value: ville,
                        label: ville
                      }))
                    ]}
                    value={filters.villeArrivee || ''}
                    onChange={(value) => handleFilterChange('villeArrivee', value)}
                    searchable={true}
                  />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Tous les statuts' },
                      ...DEMANDE_STATUTS.map((status) => ({
                        value: status.value,
                        label: status.label
                      }))
                    ]}
                    value={filters.statut || ''}
                    onChange={(value) => handleFilterChange('statut', value)}
                    searchable={false}
                  />

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}