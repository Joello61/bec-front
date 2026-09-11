'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/common';
import { Modal } from '@/components/ui';
import { useSignalementActions } from '@/lib/hooks';
import { type TraiterSignalementFormData, traiterSignalementSchema } from '@/lib/validations/signalement.schema';
import type { Signalement } from '@/types';

interface TraiterSignalementModalProps {
  signalement: Signalement;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TraiterSignalementModal({
  signalement,
  onClose,
  onSuccess,
}: TraiterSignalementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { processSignalement } = useSignalementActions();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TraiterSignalementFormData>({
    resolver: zodResolver(traiterSignalementSchema),
    defaultValues: {
      statut: 'traite',
      reponseAdmin: '',
    },
  });

  const statut = watch('statut');

  const onSubmit = async (data: TraiterSignalementFormData) => {
    setIsSubmitting(true);
    try {
      await processSignalement(signalement.id, data);
      toast.success('Signalement traité avec succès');
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Traiter le signalement</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Description du signalement</p>
          <p className="font-medium text-gray-900">{signalement.description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Decision */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="traite"
                  {...register('statut')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Traiter</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="rejete"
                  {...register('statut')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Rejeter</span>
              </label>
            </div>
            {errors.statut && (
              <p className="text-error text-sm mt-1">{errors.statut.message}</p>
            )}
          </div>

          {/* Réponse admin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Réponse (optionnel)
            </label>
            <textarea
              {...register('reponseAdmin')}
              rows={4}
              placeholder={
                statut === 'rejete'
                  ? "Expliquez pourquoi ce signalement est rejeté..."
                  : "Expliquez l'action prise suite à ce signalement..."
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {errors.reponseAdmin && (
              <p className="text-error text-sm mt-1">{errors.reponseAdmin.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
