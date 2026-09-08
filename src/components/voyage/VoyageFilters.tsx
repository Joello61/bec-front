'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Filter, RefreshCw, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui';
import type { SelectOption } from '@/components/ui/select';
import { useCitySearchGlobal, useTopCitiesGlobal } from '@/lib/hooks/useGeo';
import type { VoyageFilters as VoyageFiltersType } from '@/types';

import VoyageFilterFields from './VoyageFilterFields';

interface VoyageFiltersProps {
  onFilterChange: (filters: VoyageFiltersType) => void;
  initialFilters?: VoyageFiltersType;
  refetchVoyages?: () => void;
  isPublic?: boolean;
}

export default function VoyageFilters({
  onFilterChange,
  initialFilters = {},
  refetchVoyages,
  isPublic = false
}: VoyageFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<VoyageFiltersType>(initialFilters);

  // Top 100 villes mondiales (chargé une seule fois)
  const { topCitiesGlobal, isLoading: isLoadingTopCities } = useTopCitiesGlobal();

  // Recherche globale pour départ et arrivée
  const {
    searchResults: searchResultsDepart,
    search: searchDepart
  } = useCitySearchGlobal();

  const {
    searchResults: searchResultsArrivee,
    search: searchArrivee
  } = useCitySearchGlobal();

  // Options ville départ : Top 100 + Résultats recherche
  const optionsDepart = useMemo<SelectOption[]>(() => {
    const baseOptions: SelectOption[] = [
      { value: '', label: 'Toutes les villes' }
    ];

    if (searchResultsDepart.length > 0) {
      return [
        ...baseOptions,
        ...searchResultsDepart.map((city) => ({
          value: city.label,
          label: `${city.label} (${city.country})`,
        }))
      ];
    }

    return [
      ...baseOptions,
      ...topCitiesGlobal.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }))
    ];
  }, [topCitiesGlobal, searchResultsDepart]);

  // Options ville arrivée : Top 100 + Résultats recherche
  const optionsArrivee = useMemo<SelectOption[]>(() => {
    const baseOptions: SelectOption[] = [
      { value: '', label: 'Toutes les villes' }
    ];

    if (searchResultsArrivee.length > 0) {
      return [
        ...baseOptions,
        ...searchResultsArrivee.map((city) => ({
          value: city.label,
          label: `${city.label} (${city.country})`,
        }))
      ];
    }

    return [
      ...baseOptions,
      ...topCitiesGlobal.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }))
    ];
  }, [topCitiesGlobal, searchResultsArrivee]);

  // Recherche départ
  const handleSearchDepart = useCallback((query: string) => {
    if (query.length >= 2) {
      searchDepart(query, 50);
    }
  }, [searchDepart]);

  // Recherche arrivée
  const handleSearchArrivee = useCallback((query: string) => {
    if (query.length >= 2) {
      searchArrivee(query, 50);
    }
  }, [searchArrivee]);

  const handleFilterChange = (key: keyof VoyageFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);
  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="space-y-4">
      {/* Header avec actions - Desktop uniquement */}
      <div className="hidden md:flex items-center justify-between">
        <div className='flex items-start gap-4'>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsOpen(!isOpen)}
            leftIcon={<Filter className="w-4 h-4" />}
            rightIcon={isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            Filtres
            {hasActiveFilters && (
              <span className="ml-2 px-1.5 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={refetchVoyages}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Actualiser
          </Button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-error transition-colors flex items-center gap-1.5 font-medium"
          >
            <X className="w-4 h-4" />
            <span>Effacer tout</span>
          </button>
        )}
      </div>

      {/* Filters Panel - Desktop avec toggle */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block"
          >
            <div className="card p-6 space-y-6">
              {/* Section principale */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VoyageFilterFields
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  optionsDepart={optionsDepart}
                  optionsArrivee={optionsArrivee}
                  isLoadingTopCities={isLoadingTopCities}
                  onSearchDepart={handleSearchDepart}
                  onSearchArrivee={handleSearchArrivee}
                  isPublic={isPublic}
                  labelClassName="block text-sm font-medium text-gray-700 mb-2"
                />
              </div>

              {/* Actions au bas des filtres */}
              {hasActiveFilters && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-error hover:text-error-dark transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Réinitialiser tous les filtres</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Content - Mobile (toujours visible dans le drawer parent) */}
      <div className="md:hidden space-y-4">
        <VoyageFilterFields
          filters={filters}
          onFilterChange={handleFilterChange}
          optionsDepart={optionsDepart}
          optionsArrivee={optionsArrivee}
          isLoadingTopCities={isLoadingTopCities}
          onSearchDepart={handleSearchDepart}
          onSearchArrivee={handleSearchArrivee}
          isPublic={isPublic}
          labelClassName="block text-sm font-semibold text-gray-900 mb-2"
        />

        {/* Indicateur de filtres actifs - Mobile */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-error font-medium hover:text-error-dark transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
