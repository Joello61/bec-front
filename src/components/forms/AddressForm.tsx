'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Home, Building2, Mail as MailIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Select } from '@/components/ui';
import { updateAddressSchema, type UpdateAddressFormData } from '@/lib/validations/address.schema';
import { useCountries, useCities, useCitySearch } from '@/lib/hooks/useGeo';
import type { Address } from '@/types/address';
import type { SelectOption } from '@/components/ui/select';

interface AddressFormProps {
  address: Address;
  canModify: boolean;
  daysRemaining?: number;
  nextModificationDate?: string;
  onSubmit: (data: UpdateAddressFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function AddressForm({ 
  address, 
  canModify,
  daysRemaining,
  nextModificationDate,
  onSubmit, 
  onCancel 
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'african' | 'postal'>('african');
  const [selectedCountry, setSelectedCountry] = useState<string>(address.pays);

  // ✅ Données géographiques
  const { countries, isLoading: isLoadingCountries } = useCountries();
  const { cities, isLoading: isLoadingCities } = useCities(selectedCountry);
  
  // ✅ Recherche de villes
  const { searchResults, isSearching, search } = useCitySearch(selectedCountry);

  const isChangingCountryRef = useRef(false);
  const lastCountryRef = useRef<string>(address.pays);
  const lastContinentRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateAddressFormData>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      pays: address.pays,
      ville: address.ville,
      quartier: address.quartier || '',
      adresseLigne1: address.adresseLigne1 || '',
      adresseLigne2: address.adresseLigne2 || '',
      codePostal: address.codePostal || '',
    },
  });

  const watchPays = watch('pays');
  const watchVille = watch('ville');

  const selectedCountryData = countries.find(c => c.label === watchPays);
  const continent = selectedCountryData?.continent || '';

  // ✅ Initialisation unique
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (address.quartier) {
      setAddressType('african');
    } else if (address.adresseLigne1) {
      setAddressType('postal');
    }

    lastCountryRef.current = address.pays;
    if (continent) lastContinentRef.current = continent;
  }, [address, continent]);

  // ✅ Changement de pays
  const handleCountryChange = useCallback((newCountry: string) => {
    if (isChangingCountryRef.current) return;
    if (newCountry === lastCountryRef.current) return;
    
    isChangingCountryRef.current = true;
    lastCountryRef.current = newCountry;
    setSelectedCountry(newCountry);
    
    if (newCountry !== address.pays) {
      setTimeout(() => {
        setValue('ville', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        isChangingCountryRef.current = false;
      }, 0);
    } else {
      isChangingCountryRef.current = false;
    }
  }, [address.pays, setValue]);

  // ✅ Mise à jour type d'adresse
  useEffect(() => {
    if (!continent) return;
    if (continent === lastContinentRef.current) return;
    
    lastContinentRef.current = continent;
    const newType = continent === 'AF' ? 'african' : 'postal';
    if (newType !== addressType) setAddressType(newType);
  }, [continent, addressType]);

  const cleanFormData = useCallback(
    (data: UpdateAddressFormData): UpdateAddressFormData => ({
      ...data,
      ...(addressType === 'african' && {
        adresseLigne1: undefined,
        adresseLigne2: undefined,
        codePostal: undefined,
      }),
      ...(addressType === 'postal' && {
        quartier: undefined,
      }),
    }),
    [addressType]
  );

  const handleFormSubmit = async (data: UpdateAddressFormData) => {
    setIsSubmitting(true);
    try {
      const cleanedData = cleanFormData(data);
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Options
  const countryOptions = useMemo<SelectOption[]>(() => {
    return countries.map(c => ({
      value: c.label,
      label: c.label,
    }));
  }, [countries]);

  // ✅ Options villes : TOP 100 + Résultats de recherche
  const cityOptions = useMemo<SelectOption[]>(() => {
    if (searchResults.length > 0) {
      return searchResults.map((city) => ({
        value: city.label,
        label: city.label,
      }));
    }
    
    return cities.map((city) => ({
      value: city.label,
      label: city.label,
    }));
  }, [cities, searchResults]);

  // ✅ Recherche
  const handleCitySearch = useCallback(
    (query: string) => {
      if (query.length >= 2) {
        search(query);
      }
    },
    [search]
  );

  if (!canModify) {
    return (
      <div className="space-y-4">
        <div className="bg-warning/10 border border-warning rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning mb-1">
                Modification non autorisée
              </h3>
              <p className="text-sm text-gray-700">
                Vous pourrez modifier votre adresse dans <strong>{daysRemaining} jours</strong>
                {nextModificationDate && ` (le ${new Date(nextModificationDate).toLocaleDateString('fr-FR')})`}.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Cette restriction existe pour des raisons de sécurité et de conformité.
              </p>
            </div>
          </div>
        </div>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full">
            Retour
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Attention</p>
            <p>
              Vous ne pourrez modifier votre adresse qu&apos;une seule fois tous les 6 mois.
              Assurez-vous que les informations sont correctes avant de valider.
            </p>
          </div>
        </div>
      </div>

      {/* Pays */}
      <Controller
        name="pays"
        control={control}
        render={({ field }) => (
          <Select
            label="Pays"
            error={errors.pays?.message}
            leftIcon={<MapPin className="w-5 h-5" />}
            options={countryOptions}
            placeholder={isLoadingCountries ? 'Chargement des pays...' : 'Sélectionnez un pays'}
            required
            disabled={isLoadingCountries}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              handleCountryChange(value);
            }}
            onBlur={field.onBlur}
            searchable
          />
        )}
      />

      {/* Ville avec recherche */}
      {watchPays && (
        <Controller
          name="ville"
          control={control}
          render={({ field }) => (
            <Select
              label="Ville"
              error={errors.ville?.message}
              leftIcon={<Building2 className="w-5 h-5" />}
              options={cityOptions}
              placeholder={
                isLoadingCities || isSearching
                  ? 'Chargement...'
                  : 'Tapez pour rechercher votre ville'
              }
              required
              disabled={isLoadingCities || !watchPays}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              searchable
              onSearch={handleCitySearch} // ✅ Recherche dynamique
              helperText={
                searchResults.length > 0
                  ? `${searchResults.length} résultat(s) trouvé(s)`
                  : 'Tapez au moins 2 caractères pour rechercher'
              }
            />
          )}
        />
      )}

      {/* Format africain */}
      {addressType === 'african' && watchVille && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Input
            label="Quartier"
            type="text"
            placeholder="Ex: Bastos, Bonanjo"
            error={errors.quartier?.message}
            leftIcon={<Home className="w-5 h-5" />}
            {...register('quartier')}
            required
          />
        </motion.div>
      )}

      {/* Format postal */}
      {addressType === 'postal' && watchVille && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <Input
            label="Adresse (ligne 1)"
            type="text"
            placeholder="Ex: 21 rue du Cher"
            error={errors.adresseLigne1?.message}
            leftIcon={<Home className="w-5 h-5" />}
            {...register('adresseLigne1')}
            required
          />

          <Input
            label="Adresse (ligne 2)"
            type="text"
            placeholder="Ex: Appartement 3B (optionnel)"
            error={errors.adresseLigne2?.message}
            leftIcon={<Building2 className="w-5 h-5" />}
            {...register('adresseLigne2')}
          />

          <Input
            label="Code postal"
            type="text"
            placeholder="Ex: 31100"
            error={errors.codePostal?.message}
            leftIcon={<MailIcon className="w-5 h-5" />}
            {...register('codePostal')}
            required
          />
        </motion.div>
      )}

      {/* Info type */}
      {watchPays && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            {addressType === 'african' ? (
              <>
                <strong>Format Afrique :</strong> Indiquez votre quartier/localité.
              </>
            ) : (
              <>
                <strong>Format international :</strong> Adresse postale complète requise.
              </>
            )}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="flex-1">
            Annuler
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Enregistrement...' : "Enregistrer l'adresse"}
        </Button>
      </div>
    </form>
  );
}