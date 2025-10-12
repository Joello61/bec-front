'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MapPin, Home, Building2, Mail as MailIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Select } from '@/components/ui';
import { completeProfileSchema, type CompleteProfileFormData } from '@/lib/validations';
import { PAYS, TOUTES_VILLES, QUARTIERS_PAR_VILLE } from '@/lib/utils/constants';
import { useAuth } from '@/lib/hooks';

interface CompleteProfileFormProps {
  onSubmit: (data: CompleteProfileFormData) => Promise<void>;
}

export default function CompleteProfileForm({ onSubmit }: CompleteProfileFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'african' | 'postal'>('african');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      telephone: user?.telephone || '',
      pays: user?.pays || '',
      ville: user?.ville || '',
      quartier: user?.quartier || '',
      adresseLigne1: user?.adresseLigne1 || '',
      adresseLigne2: user?.adresseLigne2 || '',
      codePostal: user?.codePostal || '',
      bio: user?.bio || '',
      photo: user?.photo || '',
    },
  });

  const watchPays = watch('pays');
  const watchVille = watch('ville');

  // Initialiser le type d'adresse au chargement
  useEffect(() => {
    if (user?.pays) {
      const paysAfricains = [
        'Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 
        'Burkina Faso', 'Niger', 'Tchad', 'Congo', 
        'Gabon', 'Bénin', 'Togo'
      ];
      const initialAddressType = paysAfricains.includes(user.pays) ? 'african' : 'postal';
      setAddressType(initialAddressType);
    }
  }, [user]);

  // Déterminer automatiquement le type d'adresse selon le pays
  useEffect(() => {
    if (watchPays) {
      const paysAfricains = [
        'Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 
        'Burkina Faso', 'Niger', 'Tchad', 'Congo', 
        'Gabon', 'Bénin', 'Togo'
      ];
      const newAddressType = paysAfricains.includes(watchPays) ? 'african' : 'postal';
      
      if (newAddressType !== addressType) {
        setAddressType(newAddressType);
        
        // Réinitialiser les champs de l'autre type UNIQUEMENT s'ils ne viennent pas de l'utilisateur
        if (newAddressType === 'african' && !user?.quartier) {
          setValue('adresseLigne1', '');
          setValue('adresseLigne2', '');
          setValue('codePostal', '');
        } else if (newAddressType === 'postal' && !user?.adresseLigne1) {
          setValue('quartier', '');
        }
      }
    }
  }, [watchPays, addressType, setValue, user]);

  const handleFormSubmit = async (data: CompleteProfileFormData) => {
    console.log('📋 Form data before submit:', data);
    console.log('✅ Form errors:', errors);
    
    setIsSubmitting(true);
    try {
      // Nettoyer les données selon le type d'adresse
      const cleanedData: CompleteProfileFormData = {
        ...data,
        // Si format africain, vider les champs diaspora
        ...(addressType === 'african' && {
          adresseLigne1: undefined,
          adresseLigne2: undefined,
          codePostal: undefined,
        }),
        // Si format diaspora, vider le quartier
        ...(addressType === 'postal' && {
          quartier: undefined,
        }),
      };

      console.log('🧹 Cleaned data:', cleanedData);
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('❌ Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convertir en options
  const paysOptions = PAYS.map(pays => ({ value: pays, label: pays }));
  const villesOptions = TOUTES_VILLES.map(ville => ({ value: ville, label: ville }));
  
  const quartiersDisponibles = watchVille && QUARTIERS_PAR_VILLE[watchVille] 
    ? QUARTIERS_PAR_VILLE[watchVille] 
    : [];
  
  const quartiersOptions = quartiersDisponibles.map(quartier => ({ 
    value: quartier, 
    label: quartier 
  }));

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
            options={paysOptions}
            placeholder="Sélectionnez un pays"
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {/* Ville */}
      <Controller
        name="ville"
        control={control}
        render={({ field }) => (
          <Select
            label="Ville"
            error={errors.ville?.message}
            leftIcon={<Building2 className="w-5 h-5" />}
            options={villesOptions}
            placeholder="Sélectionnez une ville"
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {/* ==================== FORMAT AFRIQUE ==================== */}
      {addressType === 'african' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {quartiersOptions.length > 0 ? (
            <Controller
              name="quartier"
              control={control}
              render={({ field }) => (
                <Select
                  label="Quartier"
                  error={errors.quartier?.message}
                  leftIcon={<Home className="w-5 h-5" />}
                  options={quartiersOptions}
                  placeholder="Sélectionnez un quartier"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          ) : (
            <Input
              label="Quartier"
              type="text"
              placeholder="Ex: Bastos, Bonanjo"
              error={errors.quartier?.message}
              leftIcon={<Home className="w-5 h-5" />}
              {...register('quartier')}
              required
            />
          )}
        </motion.div>
      )}

      {/* ==================== FORMAT DIASPORA ==================== */}
      {addressType === 'postal' && (
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

      {/* Info sur le type d'adresse */}
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