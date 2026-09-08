import { Controller, type Control, type FieldErrors, type Path } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { Select } from '@/components/ui';
import type { SelectOption } from '@/components/ui/select';

interface RouteFormValues {
  villeDepart: string;
  villeArrivee: string;
}

interface CityRouteFieldsProps<T extends RouteFormValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  optionsDepart: SelectOption[];
  optionsArrivee: SelectOption[];
  isLoadingTopCities: boolean;
  onSearchDepart: (query: string) => void;
  onSearchArrivee: (query: string) => void;
  helperDepart: string;
  helperArrivee: string;
}

export default function CityRouteFields<T extends RouteFormValues>({
  control,
  errors,
  optionsDepart,
  optionsArrivee,
  isLoadingTopCities,
  onSearchDepart,
  onSearchArrivee,
  helperDepart,
  helperArrivee,
}: CityRouteFieldsProps<T>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Controller
        name={'villeDepart' as Path<T>}
        control={control}
        render={({ field }) => (
          <Select
            label="Ville de départ"
            required
            leftIcon={<MapPin className="w-5 h-5" />}
            options={optionsDepart}
            placeholder={isLoadingTopCities ? 'Chargement...' : 'Sélectionnez ou recherchez une ville'}
            disabled={isLoadingTopCities}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.villeDepart?.message as string | undefined}
            searchable
            onSearch={onSearchDepart}
            helperText={helperDepart}
          />
        )}
      />

      <Controller
        name={'villeArrivee' as Path<T>}
        control={control}
        render={({ field }) => (
          <Select
            label="Ville d'arrivée"
            required
            leftIcon={<MapPin className="w-5 h-5" />}
            options={optionsArrivee}
            placeholder={isLoadingTopCities ? 'Chargement...' : 'Sélectionnez ou recherchez une ville'}
            disabled={isLoadingTopCities}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.villeArrivee?.message as string | undefined}
            searchable
            onSearch={onSearchArrivee}
            helperText={helperArrivee}
          />
        )}
      />
    </div>
  );
}
