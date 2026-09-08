'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MapPin, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Select } from '@/components/ui';
import { completeProfileSchema, type CompleteProfileFormData } from '@/lib/validations';
import { useAuth } from '@/lib/hooks';
import { useCountries, useCities, useCitySearch } from '@/lib/hooks/useGeo';
import type { SelectOption } from '@/components/ui/select';
import { useAvatar } from '@/lib/hooks/useUsers';
import AvatarUploadField from './AvatarUploadField';
import AddressTypeFields from './AddressTypeFields';

export default function CompleteProfileForm({
  onSubmit,
}: {
  onSubmit: (data: CompleteProfileFormData) => Promise<void>;
}) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'african' | 'postal'>('african');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const lastContinentRef = useRef<string>('');

  // Hook pour l'avatar
  const { 
    uploadAvatar, 
    deleteAvatar,
    isUploading, 
    error: uploadError,
    clearError,
    currentAvatar 
  } = useAvatar();

  // Données géographiques
  const { countries, isLoading: isLoadingCountries } = useCountries();
  const { cities, isLoading: isLoadingCities } = useCities(selectedCountry);
  
  // Recherche de villes (autocomplete)
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

  // Initialiser le pays sélectionné au chargement
  useEffect(() => {
    if (defaultValues.pays && !selectedCountry) {
      setSelectedCountry(defaultValues.pays);
    }
  }, [defaultValues.pays, selectedCountry]);

  // Détecter le type d'adresse initial depuis user.address
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

  // Mise à jour du type d'adresse selon continent
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

  // Options pays
  const countryOptions = useMemo<SelectOption[]>(() => {
    return countries.map((c) => ({
      value: c.label,
      label: c.label,
    }));
  }, [countries]);

  // Options villes : TOP 100 + Résultats de recherche combinés
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

  // Handler de recherche avec debounce
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
      photo: undefined, // On ne passe pas la photo dans le formulaire
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

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    clearError();
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avatar:', error);
    }
  };

  const handleFormSubmit = async (data: CompleteProfileFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Si un fichier est sélectionné, on l'upload en premier
      if (selectedFile) {
        try {
          await uploadAvatar(selectedFile);
          // L'avatar est maintenant uploadé et le store est mis à jour
        } catch (error) {
          console.error('Erreur lors de l\'upload de l\'avatar:', error);
          // On continue quand même avec la complétion du profil
        }
      }

      // 2. Ensuite on complète le profil (sans la photo)
      const cleanedData = cleanFormData(data);
      await onSubmit(cleanedData);

      // Réinitialiser le fichier sélectionné après succès
      setSelectedFile(null);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || isUploading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Photo de profil */}
      <AvatarUploadField
        label="Photo de profil (optionnel)"
        fallbackName={user ? `${user.nom} ${user.prenom}` : 'User'}
        currentAvatar={currentAvatar}
        selectedFile={selectedFile}
        uploadError={uploadError}
        isProcessing={isProcessing}
        onFileSelect={handleFileSelect}
        onDeleteAvatar={handleDeleteAvatar}
      />

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
        disabled={!!user?.telephone && user?.telephoneVerifie || isProcessing}
      />
      {user?.telephone && user?.telephoneVerifie && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          Téléphone déjà vérifié
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
            disabled={isLoadingCountries || isProcessing}
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
              disabled={isLoadingCities || !watchPays || isProcessing}
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

      <AddressTypeFields
        addressType={addressType}
        watchPays={watchPays}
        watchVille={watchVille}
        register={register}
        errors={errors}
        disabled={isProcessing}
      />

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
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            variant="primary"
            isLoading={isProcessing}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Envoi en cours...' : 'Compléter mon profil'}
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