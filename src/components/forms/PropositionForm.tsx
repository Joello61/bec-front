'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Info } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import {
  createPropositionSchema,
  type CreatePropositionFormData,
} from '@/lib/validations';
import { useUserCurrency } from '@/lib/hooks/useCurrency';
import { getCurrencySymbol } from '@/lib/utils/format';
import type { Voyage } from '@/types';

interface PropositionFormProps {
  voyage: Voyage;
  userDemandes: Array<{
    id: number;
    villeDepart: string;
    villeArrivee: string;
  }>;
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
  const {userCurrency} = useUserCurrency();
  const currencySymbol = getCurrencySymbol(userCurrency);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropositionFormData>({
    resolver: zodResolver(createPropositionSchema),
    defaultValues: {
      prixParKilo: voyage.prixParKilo
        ? parseFloat(voyage.prixParKilo)
        : undefined,
      commissionProposeePourUnBagage: voyage.commissionProposeePourUnBagage
        ? parseFloat(voyage.commissionProposeePourUnBagage)
        : undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Sélection de la demande */}
      <Controller
        name="demandeId"
        control={control}
        render={({ field }) => (
          <Select
            label="Sélectionnez votre demande"
            required
            options={[
              { value: '', label: 'Choisissez une demande' },
              ...userDemandes.map((demande) => ({
                value: demande.id.toString(),
                label: `${demande.villeDepart} vers ${demande.villeArrivee}`
              }))
            ]}
            value={field.value?.toString() || ''}
            onChange={(value) => field.onChange(value ? Number(value) : '')}
            onBlur={field.onBlur}
            error={errors.demandeId?.message}
            searchable={true}
          />
        )}
      />

      {/* ==================== SECTION PRIX AVEC DEVISE DYNAMIQUE ==================== */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Votre proposition</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium text-primary">
              Devise : {currencySymbol}
            </span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Les montants sont dans votre devise ({userCurrency}). Le voyageur les verra 
            automatiquement convertis dans sa devise.
          </p>
        </div>

        {/* Prix par kilo */}
        <Input
          label={`Prix par kilo (${currencySymbol})`}
          type="number"
          min="0"
          max="100000"
          placeholder={voyage.prixParKilo || '5000'}
          error={errors.prixParKilo?.message}
          helperText="Prix que vous proposez par kilogramme"
          {...register('prixParKilo', { valueAsNumber: true })}
          required
        />

        {/* Commission pour un bagage */}
        <div className="mt-4">
          <Input
            label={`Commission pour un bagage complet (${currencySymbol})`}
            type="number"
            min="0"
            max="1000000"
            placeholder={voyage.commissionProposeePourUnBagage || '50000'}
            error={errors.commissionProposeePourUnBagage?.message}
            helperText="Commission que vous proposez pour un bagage entier"
            {...register('commissionProposeePourUnBagage', { valueAsNumber: true })}
            required
          />
        </div>
      </div>

      {/* Message optionnel */}
      <div>
        <label
          htmlFor="message"
          className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
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
        <p className="mt-1 text-xs text-gray-500">Maximum 1000 caractères</p>
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