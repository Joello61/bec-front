'use client';

import { useState, useMemo, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, Info, MapPin, AlertCircle } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { createVoyageSchema, type CreateVoyageFormData } from '@/lib/validations';
import { useTopCitiesGlobal, useCitySearchGlobal } from '@/lib/hooks/useGeo';
import { useUserCurrency } from '@/lib/hooks/useCurrency';
import { getCurrencySymbol } from '@/lib/utils/format';
import type { Voyage } from '@/types';
import type { SelectOption } from '@/components/ui/select';

interface VoyageFormProps {
  voyage?: Voyage;
  onSubmit: (data: CreateVoyageFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function VoyageForm({ voyage, onSubmit, onCancel }: VoyageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Devise utilisateur
  const userCurrency = useUserCurrency();
  const currencySymbol = getCurrencySymbol(userCurrency);

  // ✅ Top 100 villes mondiales (chargé une seule fois)
  const { topCitiesGlobal, isLoading: isLoadingTopCities } = useTopCitiesGlobal();

  // ✅ Recherche globale
  const { 
    searchResults: searchResultsDepart, 
    isSearching: isSearchingDepart,
    search: searchDepart 
  } = useCitySearchGlobal();

  const { 
    searchResults: searchResultsArrivee, 
    isSearching: isSearchingArrivee,
    search: searchArrivee 
  } = useCitySearchGlobal();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateVoyageFormData>({
    resolver: zodResolver(createVoyageSchema),
    defaultValues: voyage
      ? {
          villeDepart: voyage.villeDepart,
          villeArrivee: voyage.villeArrivee,
          dateDepart: voyage.dateDepart.split('T')[0],
          dateArrivee: voyage.dateArrivee.split('T')[0],
          poidsDisponible: parseFloat(voyage.poidsDisponible),
          prixParKilo: voyage.prixParKilo ? parseFloat(voyage.prixParKilo) : undefined,
          commissionProposeePourUnBagage: voyage.commissionProposeePourUnBagage 
            ? parseFloat(voyage.commissionProposeePourUnBagage) 
            : undefined,
          description: voyage.description || '',
        }
      : undefined,
  });

  // ✅ Surveiller les villes sélectionnées pour détecter les doublons
  const watchVilleDepart = watch('villeDepart');
  const watchVilleArrivee = watch('villeArrivee');

  // ✅ Options ville départ : Top 100 + Résultats recherche
  const optionsDepart = useMemo<SelectOption[]>(() => {
    if (searchResultsDepart.length > 0) {
      return searchResultsDepart.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }));
    }
    
    return topCitiesGlobal.map((city) => ({
      value: city.label,
      label: `${city.label} (${city.country})`,
    }));
  }, [topCitiesGlobal, searchResultsDepart]);

  // ✅ Options ville arrivée : Top 100 + Résultats recherche
  const optionsArrivee = useMemo<SelectOption[]>(() => {
    if (searchResultsArrivee.length > 0) {
      return searchResultsArrivee.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }));
    }
    
    return topCitiesGlobal.map((city) => ({
      value: city.label,
      label: `${city.label} (${city.country})`,
    }));
  }, [topCitiesGlobal, searchResultsArrivee]);

  // ✅ Recherche départ
  const handleSearchDepart = useCallback((query: string) => {
    if (query.length >= 2) {
      searchDepart(query, 50);
    }
  }, [searchDepart]);

  // ✅ Recherche arrivée
  const handleSearchArrivee = useCallback((query: string) => {
    if (query.length >= 2) {
      searchArrivee(query, 50);
    }
  }, [searchArrivee]);

  const handleFormSubmit = async (data: CreateVoyageFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Détection des villes identiques (warning visuel)
  const showCityWarning = watchVilleDepart && watchVilleArrivee && 
    watchVilleDepart.trim().toLowerCase() === watchVilleArrivee.trim().toLowerCase();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* ✅ Warning villes identiques */}
      {showCityWarning && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning mb-1">
                Villes identiques
              </h3>
              <p className="text-sm text-gray-700">
                La ville de départ et la ville d&apos;arrivée sont les mêmes. 
                Veuillez sélectionner des villes différentes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Sélection des villes avec recherche globale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="villeDepart"
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
              error={errors.villeDepart?.message}
              searchable
              onSearch={handleSearchDepart}
              helperText={
                searchResultsDepart.length > 0
                  ? `${searchResultsDepart.length} résultat(s) trouvé(s)`
                  : isSearchingDepart
                  ? 'Recherche en cours...'
                  : 'Top 100 des villes mondiales affichées'
              }
            />
          )}
        />

        <Controller
          name="villeArrivee"
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
              error={errors.villeArrivee?.message}
              searchable
              onSearch={handleSearchArrivee}
              helperText={
                searchResultsArrivee.length > 0
                  ? `${searchResultsArrivee.length} résultat(s) trouvé(s)`
                  : isSearchingArrivee
                  ? 'Recherche en cours...'
                  : 'Top 100 des villes mondiales affichées'
              }
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date de départ"
          type="date"
          error={errors.dateDepart?.message}
          {...register('dateDepart')}
          required
        />

        <Input
          label="Date d'arrivée"
          type="date"
          error={errors.dateArrivee?.message}
          {...register('dateArrivee')}
          required
        />
      </div>

      <Input
        label="Poids disponible (kg)"
        type="number"
        step="0.1"
        min="1"
        max="100"
        placeholder="15"
        error={errors.poidsDisponible?.message}
        helperText="Poids maximum que vous pouvez transporter"
        {...register('poidsDisponible', { valueAsNumber: true })}
        required
      />

      {/* ==================== SECTION TARIFICATION ==================== */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tarification (optionnel)</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium text-primary">
              Devise : {currencySymbol}
            </span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Les montants sont dans votre devise ({userCurrency}). Ils seront automatiquement 
            convertis pour les clients utilisant d&apos;autres devises.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={`Prix par kilo (${currencySymbol})`}
            type="number"
            min="0"
            max="100000"
            placeholder="5000"
            error={errors.prixParKilo?.message}
            helperText="Prix suggéré par kilogramme"
            {...register('prixParKilo', { valueAsNumber: true })}
          />

          <Input
            label={`Commission pour un bagage (${currencySymbol})`}
            type="number"
            min="0"
            max="1000000"
            placeholder="50000"
            error={errors.commissionProposeePourUnBagage?.message}
            helperText="Commission suggérée pour un bagage entier"
            {...register('commissionProposeePourUnBagage', { valueAsNumber: true })}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Ces informations aident les clients à évaluer votre offre. Ils pourront faire des contre-propositions.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="input"
          placeholder="Informations supplémentaires sur votre voyage..."
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<Plane className="w-4 h-4" />}
          className="flex-1"
        >
          {voyage ? 'Modifier le voyage' : 'Créer le voyage'}
        </Button>
      </div>
    </form>
  );
}