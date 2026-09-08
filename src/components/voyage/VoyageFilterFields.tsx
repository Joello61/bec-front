import { MapPin } from 'lucide-react';
import { Input, Select } from '@/components/ui';
import { VOYAGE_STATUTS } from '@/lib/utils/constants';
import type { VoyageFilters as VoyageFiltersType } from '@/types';
import type { SelectOption } from '@/components/ui/select';

interface VoyageFilterFieldsProps {
  filters: VoyageFiltersType;
  onFilterChange: (key: keyof VoyageFiltersType, value: string) => void;
  optionsDepart: SelectOption[];
  optionsArrivee: SelectOption[];
  isLoadingTopCities: boolean;
  onSearchDepart: (query: string) => void;
  onSearchArrivee: (query: string) => void;
  isPublic: boolean;
  labelClassName: string;
}

export default function VoyageFilterFields({
  filters,
  onFilterChange,
  optionsDepart,
  optionsArrivee,
  isLoadingTopCities,
  onSearchDepart,
  onSearchArrivee,
  isPublic,
  labelClassName,
}: VoyageFilterFieldsProps) {
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

      {/* Date de départ */}
      <div>
        <label className={labelClassName}>
          Date de départ
        </label>
        <Input
          type="date"
          value={filters.dateDepart || ''}
          onChange={(e) => onFilterChange('dateDepart', e.target.value)}
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
              ...VOYAGE_STATUTS.map((status) => ({
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
