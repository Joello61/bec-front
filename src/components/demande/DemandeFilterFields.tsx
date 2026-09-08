import { Calendar, MapPin } from 'lucide-react';

import { Input, Select } from '@/components/ui';
import type { SelectOption } from '@/components/ui/select';
import { DEMANDE_STATUTS } from '@/lib/utils/constants';
import type { DemandeFilters as DemandeFiltersType } from '@/types';

interface DemandeFilterFieldsProps {
  filters: DemandeFiltersType;
  onFilterChange: (key: keyof DemandeFiltersType, value: string) => void;
  optionsDepart: SelectOption[];
  optionsArrivee: SelectOption[];
  isLoadingTopCities: boolean;
  onSearchDepart: (query: string) => void;
  onSearchArrivee: (query: string) => void;
  isPublic: boolean;
  labelClassName: string;
}

export default function DemandeFilterFields({
  filters,
  onFilterChange,
  optionsDepart,
  optionsArrivee,
  isLoadingTopCities,
  onSearchDepart,
  onSearchArrivee,
  isPublic,
  labelClassName,
}: DemandeFilterFieldsProps) {
  return (
    <>
      {/* Ville de départ avec recherche */}
      <div>
        <label className={labelClassName}>
          Ville de départ
        </label>
        <Select
          leftIcon={<MapPin className="w-5 h-5" />}
          options={optionsDepart}
          value={filters.villeDepart || ''}
          onChange={(value) => onFilterChange('villeDepart', value)}
          placeholder={isLoadingTopCities ? 'Chargement...' : 'Toutes les villes'}
          disabled={isLoadingTopCities}
          searchable
          onSearch={onSearchDepart}
        />
      </div>

      {/* Ville d'arrivée avec recherche */}
      <div>
        <label className={labelClassName}>
          Ville d&apos;arrivée
        </label>
        <Select
          leftIcon={<MapPin className="w-5 h-5" />}
          options={optionsArrivee}
          value={filters.villeArrivee || ''}
          onChange={(value) => onFilterChange('villeArrivee', value)}
          placeholder={isLoadingTopCities ? 'Chargement...' : 'Toutes les villes'}
          disabled={isLoadingTopCities}
          searchable
          onSearch={onSearchArrivee}
        />
      </div>

      {/* Date limite */}
      <div>
        <label className={labelClassName}>
          Date limite
        </label>
        <Input
          type="date"
          value={filters.dateLimite || ''}
          onChange={(e) => onFilterChange('dateLimite', e.target.value)}
          leftIcon={<Calendar className="w-5 h-5" />}
          className="w-full"
        />
      </div>

      {/* Statut */}
      {!isPublic && (
        <div>
          <label className={labelClassName}>
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
            onChange={(value) => onFilterChange('statut', value)}
            searchable={false}
          />
        </div>
      )}
    </>
  );
}
