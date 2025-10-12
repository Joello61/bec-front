'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Home, Building2, Mail as MailIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Select } from '@/components/ui';
import { updateAddressSchema, type UpdateAddressFormData } from '@/lib/validations/address.schema';
import { PAYS, TOUTES_VILLES, QUARTIERS_PAR_VILLE } from '@/lib/utils/constants';
import type { Address } from '@/types/address';

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

  // Déterminer le type d'adresse initial
  useEffect(() => {
    if (address.quartier) {
      setAddressType('african');
    } else if (address.adresseLigne1) {
      setAddressType('postal');
    }
  }, [address]);

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
        
        // Réinitialiser les champs de l'autre type
        if (newAddressType === 'african') {
          setValue('adresseLigne1', '');
          setValue('adresseLigne2', '');
          setValue('codePostal', '');
        } else {
          setValue('quartier', '');
        }
      }
    }
  }, [watchPays, addressType, setValue]);

  const handleFormSubmit = async (data: UpdateAddressFormData) => {
    setIsSubmitting(true);
    try {
      // Nettoyer les données selon le type d'adresse
      const cleanedData: UpdateAddressFormData = {
        ...data,
        ...(addressType === 'african' && {
          adresseLigne1: undefined,
          adresseLigne2: undefined,
          codePostal: undefined,
        }),
        ...(addressType === 'postal' && {
          quartier: undefined,
        }),
      };

      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Form submission error:', error);
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

  // Si modification non autorisée
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
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Retour
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Info contrainte */}
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

      {/* FORMAT AFRIQUE */}
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

      {/* FORMAT DIASPORA */}
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

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
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
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'adresse'}
        </Button>
      </div>
    </form>
  );
}