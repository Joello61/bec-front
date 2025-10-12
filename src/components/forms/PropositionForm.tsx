'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Info } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  createPropositionSchema,
  type CreatePropositionFormData,
} from '@/lib/validations';
import { useUserCurrency } from '@/lib/hooks/useCurrency'; // ⬅️ AJOUT
import { getCurrencySymbol } from '@/lib/utils/format'; // ⬅️ AJOUT
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
  // ⬅️ AJOUT : Récupérer la devise de l'utilisateur
  const userCurrency = useUserCurrency();
  const currencySymbol = getCurrencySymbol(userCurrency);

  const {
    register,
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
      <div>
        <label
          htmlFor="demandeId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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
              {demande.villeDepart} vers {demande.villeArrivee}
            </option>
          ))}
        </select>
        {errors.demandeId && (
          <p className="mt-1 text-sm text-error">{errors.demandeId.message}</p>
        )}
      </div>

      {/* ==================== SECTION PRIX AVEC DEVISE DYNAMIQUE ==================== */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Votre proposition</h3>
          {/* Badge devise de l'utilisateur */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium text-primary">
              Devise : {currencySymbol}
            </span>
          </div>
        </div>

        {/* Message informatif */}
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
          step="100"
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
            step="1000"
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