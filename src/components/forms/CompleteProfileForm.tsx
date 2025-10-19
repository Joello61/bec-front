'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MapPin, Home, Building2, Mail as MailIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Select } from '@/components/ui';
import { completeProfileSchema, type CompleteProfileFormData } from '@/lib/validations';
import { useAuth } from '@/lib/hooks';
import { useCountries, useCities, useCitySearch } from '@/lib/hooks/useGeo';
import type { SelectOption } from '@/components/ui/select';

export default function CompleteProfileForm({
  onSubmit,
}: {
  onSubmit: (data: CompleteProfileFormData) => Promise<void>;
}) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'african' | 'postal'>('african');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const lastContinentRef = useRef<string>('');

  // ✅ Données géographiques
  const { countries, isLoading: isLoadingCountries } = useCountries();
  const { cities, isLoading: isLoadingCities } = useCities(selectedCountry);
  
  // ✅ Recherche de villes (autocomplete)
  const { searchResults, isSearching, search } = useCitySearch(selectedCountry);

  // ==================== PRÉ-REMPLISSAGE AVEC user.address ====================
  const defaultValues = useMemo<CompleteProfileFormData>(() => {
    const address = user?.address;
    
    return {
      telephone: user?.telephone || '',
      pays: address?.pays || '',
      ville: address?.ville || '',
      quartier: address?.quartier || '',
      adresseLigne1: address?.adresseLigne1 || '',
      adresseLigne2: address?.adresseLigne2 || '',
      codePostal: address?.codePostal || '',
      bio: user?.bio || '',
      photo: user?.photo || '',
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues,
  });

  const watchPays = watch('pays');
  const watchVille = watch('ville');

  const selectedCountryData = countries.find((c) => c.label === watchPays);
  const continent = selectedCountryData?.continent || '';

  // ✅ Initialiser le pays sélectionné au chargement
  useEffect(() => {
    if (defaultValues.pays && !selectedCountry) {
      setSelectedCountry(defaultValues.pays);
    }
  }, [defaultValues.pays, selectedCountry]);

  // ✅ Détecter le type d'adresse initial depuis user.address
  useEffect(() => {
    if (user?.address) {
      const hasQuartier = !!user.address.quartier;
      const hasPostal = !!user.address.adresseLigne1 || !!user.address.codePostal;
      
      if (hasQuartier) {
        setAddressType('african');
      } else if (hasPostal) {
        setAddressType('postal');
      }
    }
  }, [user?.address]);

  // ✅ Mise à jour du type d'adresse selon continent
  useEffect(() => {
    if (!continent || continent === lastContinentRef.current) return;

    lastContinentRef.current = continent;
    const newType = continent === 'AF' ? 'african' : 'postal';

    if (newType !== addressType) {
      setAddressType(newType);
      if (newType === 'african') {
        setValue('adresseLigne1', '');
        setValue('adresseLigne2', '');
        setValue('codePostal', '');
      } else {
        setValue('quartier', '');
      }
    }
  }, [continent, addressType, setValue]);

  useEffect(() => {
    if (watchPays) {
      setSelectedCountry(watchPays);
    }
  }, [watchPays]);

  // ✅ Options pays
  const countryOptions = useMemo<SelectOption[]>(() => {
    return countries.map((c) => ({
      value: c.label,
      label: c.label,
    }));
  }, [countries]);

  // ✅ Options villes : TOP 100 + Résultats de recherche combinés
  const cityOptions = useMemo<SelectOption[]>(() => {
    // Si on a des résultats de recherche, les afficher en priorité
    if (searchResults.length > 0) {
      return searchResults.map((city) => ({
        value: city.label,
        label: city.label,
      }));
    }
    
    // Sinon, afficher le top 100
    return cities.map((city) => ({
      value: city.label,
      label: city.label,
    }));
  }, [cities, searchResults]);

  // ✅ Handler de recherche avec debounce
  const handleCitySearch = useCallback(
    (query: string) => {
      if (query.length >= 2) {
        search(query);
      }
    },
    [search]
  );

  const cleanFormData = useCallback(
    (data: CompleteProfileFormData): CompleteProfileFormData => ({
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

  const handleFormSubmit = async (data: CompleteProfileFormData) => {
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Téléphone */}
      <Input
        label="Numéro de téléphone"
        type="tel"
        placeholder="+237 6XX XX XX XX"
        error={errors.telephone?.message}
        helperText="Format international: +237XXXXXXXXX"
        leftIcon={<Phone className="w-5 h-5" />}
        {...register('telephone')}
        required
        disabled={!!user?.telephone && user?.telephoneVerifie}
      />
      {user?.telephone && user?.telephoneVerifie && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          ✓ Téléphone déjà vérifié
        </p>
      )}

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
              setSelectedCountry(value);
              setValue('ville', ''); // Reset ville quand on change de pays
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
              onSearch={handleCitySearch}
              helperText={
                searchResults.length > 0
                  ? `${searchResults.length} résultat(s) trouvé(s)`
                  : 'Tapez au moins 2 caractères pour rechercher'
              }
            />
          )}
        />
      )}

      {/* Format Afrique */}
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

      {/* Info type d'adresse */}
      {watchPays && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
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

      {/* Champs optionnels */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Informations complémentaires (optionnel)
        </h3>

        <div className="space-y-4">
          <Input
            label="Bio"
            type="text"
            placeholder="Parlez-nous de vous..."
            error={errors.bio?.message}
            helperText="500 caractères maximum"
            {...register('bio')}
          />

          <Input
            label="Photo de profil (URL)"
            type="url"
            placeholder="https://exemple.com/photo.jpg"
            error={errors.photo?.message}
            {...register('photo')}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Compléter mon profil'}
          </Button>
        </motion.div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {user?.telephoneVerifie
            ? 'Vos informations seront mises à jour'
            : 'Un code de vérification sera envoyé par SMS à votre numéro'}
        </p>
      </div>
    </form>
  );
}