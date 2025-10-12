'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, DollarSign } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createDemandeSchema, type CreateDemandeFormData } from '@/lib/validations';
import { TOUTES_VILLES } from '@/lib/utils/constants';
import type { Demande } from '@/types';

interface DemandeFormProps {
  demande?: Demande;
  onSubmit: (data: CreateDemandeFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function DemandeForm({ demande, onSubmit, onCancel }: DemandeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDemandeFormData>({
    resolver: zodResolver(createDemandeSchema),
    defaultValues: demande
      ? {
          villeDepart: demande.villeDepart,
          villeArrivee: demande.villeArrivee,
          dateLimite: demande.dateLimite?.split('T')[0] || '',
          poidsEstime: parseFloat(demande.poidsEstime),
          prixParKilo: demande.prixParKilo ? parseFloat(demande.prixParKilo) : undefined,
          commissionProposeePourUnBagage: demande.commissionProposeePourUnBagage 
            ? parseFloat(demande.commissionProposeePourUnBagage) 
            : undefined,
          description: demande.description,
        }
      : undefined,
  });

  const handleFormSubmit = async (data: CreateDemandeFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="villeDepart" className="block text-sm font-medium text-gray-700 mb-2">
            Ville de départ <span className="text-error">*</span>
          </label>
          <select id="villeDepart" className="input" {...register('villeDepart')}>
            <option value="">Sélectionnez une ville</option>
            {TOUTES_VILLES.map((ville) => (
              <option key={ville} value={ville}>
                {ville}
              </option>
            ))}
          </select>
          {errors.villeDepart && (
            <p className="mt-1 text-sm text-error">{errors.villeDepart.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="villeArrivee" className="block text-sm font-medium text-gray-700 mb-2">
            Ville d&apos;arrivée <span className="text-error">*</span>
          </label>
          <select id="villeArrivee" className="input" {...register('villeArrivee')}>
            <option value="">Sélectionnez une ville</option>
            {TOUTES_VILLES.map((ville) => (
              <option key={ville} value={ville}>
                {ville}
              </option>
            ))}
          </select>
          {errors.villeArrivee && (
            <p className="mt-1 text-sm text-error">{errors.villeArrivee.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date limite (optionnel)"
          type="date"
          error={errors.dateLimite?.message}
          helperText="Date limite pour trouver un voyageur"
          {...register('dateLimite')}
        />

        <Input
          label="Poids estimé (kg)"
          type="number"
          step="0.1"
          min="0.1"
          max="50"
          placeholder="5"
          error={errors.poidsEstime?.message}
          {...register('poidsEstime', { valueAsNumber: true })}
          required
        />
      </div>

      {/* ==================== NOUVEAUX CHAMPS ==================== */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget (optionnel)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prix max par kilo (XAF)"
            type="number"
            min="0"
            max="100000"
            placeholder="5000"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.prixParKilo?.message}
            helperText="Budget maximum par kilogramme"
            {...register('prixParKilo', { valueAsNumber: true })}
          />

          <Input
            label="Commission max pour bagage (XAF)"
            type="number"
            min="0"
            max="1000000"
            placeholder="50000"
            leftIcon={<Package className="w-4 h-4" />}
            error={errors.commissionProposeePourUnBagage?.message}
            helperText="Commission max pour un bagage entier"
            {...register('commissionProposeePourUnBagage', { valueAsNumber: true })}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Ces informations aident les voyageurs à évaluer si votre demande correspond à leurs attentes.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          rows={5}
          className="input"
          placeholder="Décrivez ce que vous souhaitez faire transporter..."
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">{errors.description.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Minimum 10 caractères
        </p>
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
          leftIcon={<Package className="w-4 h-4" />}
          className="flex-1"
        >
          {demande ? 'Modifier la demande' : 'Créer la demande'}
        </Button>
      </div>
    </form>
  );
}