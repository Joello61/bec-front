'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Package, MessageSquare } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createPropositionSchema, type CreatePropositionFormData } from '@/lib/validations';
import type { Voyage } from '@/types';

interface PropositionFormProps {
  voyage: Voyage;
  userDemandes: Array<{ id: number; villeDepart: string; villeArrivee: string }>;
  onSubmit: (data: CreatePropositionFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function PropositionForm({
  voyage,
  userDemandes,
  onSubmit,
  onCancel,
  isSubmitting,
}: PropositionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropositionFormData>({
    resolver: zodResolver(createPropositionSchema),
    defaultValues: {
      prixParKilo: voyage.prixParKilo ? parseFloat(voyage.prixParKilo) : undefined,
      commissionProposeePourUnBagage: voyage.commissionProposeePourUnBagage 
        ? parseFloat(voyage.commissionProposeePourUnBagage) 
        : undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Sélection de la demande */}
      <div>
        <label htmlFor="demandeId" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez votre demande <span className="text-error">*</span>
        </label>
        <select
          id="demandeId"
          className="input"
          {...register('demandeId', { valueAsNumber: true })}
        >
          <option value="">Choisissez une demande</option>
          {userDemandes.map((demande) => (
            <option key={demande.id} value={demande.id}>
              {demande.villeDepart} → {demande.villeArrivee}
            </option>
          ))}
        </select>
        {errors.demandeId && (
          <p className="mt-1 text-sm text-error">{errors.demandeId.message}</p>
        )}
      </div>

      {/* Prix par kilo */}
      <Input
        label="Prix par kilo (XAF)"
        type="number"
        step="100"
        min="0"
        max="100000"
        placeholder={voyage.prixParKilo || '5000'}
        leftIcon={<DollarSign className="w-4 h-4" />}
        error={errors.prixParKilo?.message}
        helperText="Prix que vous proposez par kilogramme"
        {...register('prixParKilo', { valueAsNumber: true })}
        required
      />

      {/* Commission pour un bagage */}
      <Input
        label="Commission pour un bagage complet (XAF)"
        type="number"
        step="1000"
        min="0"
        max="1000000"
        placeholder={voyage.commissionProposeePourUnBagage || '50000'}
        leftIcon={<Package className="w-4 h-4" />}
        error={errors.commissionProposeePourUnBagage?.message}
        helperText="Commission que vous proposez pour un bagage entier"
        {...register('commissionProposeePourUnBagage', { valueAsNumber: true })}
        required
      />

      {/* Message optionnel */}
      <div>
        <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Message (optionnel)
        </label>
        <textarea
          id="message"
          rows={4}
          className="input"
          placeholder="Ajoutez un message pour le voyageur..."
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Maximum 1000 caractères
        </p>
      </div>

      {/* Actions */}
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
          className="flex-1"
        >
          Envoyer la proposition
        </Button>
      </div>
    </form>
  );
}