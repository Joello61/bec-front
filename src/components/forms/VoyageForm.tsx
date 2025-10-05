'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, DollarSign, Package } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createVoyageSchema, type CreateVoyageFormData } from '@/lib/validations';
import { TOUTES_VILLES } from '@/lib/utils/constants';
import type { Voyage } from '@/types';

interface VoyageFormProps {
  voyage?: Voyage;
  onSubmit: (data: CreateVoyageFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function VoyageForm({ voyage, onSubmit, onCancel }: VoyageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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

  const handleFormSubmit = async (data: CreateVoyageFormData) => {
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

      {/* ==================== NOUVEAUX CHAMPS ==================== */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarification (optionnel)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prix par kilo (XAF)"
            type="number"
            step="100"
            min="0"
            max="100000"
            placeholder="5000"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.prixParKilo?.message}
            helperText="Prix suggéré par kilogramme"
            {...register('prixParKilo', { valueAsNumber: true })}
          />

          <Input
            label="Commission pour un bagage (XAF)"
            type="number"
            step="1000"
            min="0"
            max="1000000"
            placeholder="50000"
            leftIcon={<Package className="w-4 h-4" />}
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