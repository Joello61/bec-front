'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { createSignalementSchema, type CreateSignalementFormData } from '@/lib/validations';

interface SignalementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSignalementFormData) => Promise<void>;
  voyageId?: number;
  demandeId?: number;
  messageId?: number;
  utilisateurSignaleId?: number;
}

const SIGNALEMENT_MOTIFS = [
  { value: 'contenu_inapproprie', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'arnaque', label: 'Arnaque ou fraude' },
  { value: 'objet_illegal', label: 'Objet illégal' },
  { value: 'autre', label: 'Autre' },
] as const;

export default function SignalementForm({
  isOpen,
  onClose,
  onSubmit,
  voyageId,
  demandeId,
  messageId,
  utilisateurSignaleId,
}: SignalementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSignalementFormData>({
    resolver: zodResolver(createSignalementSchema),
    defaultValues: {
      voyageId,
      demandeId,
      messageId,
      utilisateurSignaleId,
      motif: 'contenu_inapproprie',
      description: '',
    },
  });

  const handleFormSubmit = async (data: CreateSignalementFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Déterminer le type d'entité pour le titre
  const getEntityType = () => {
    if (voyageId) return 'ce voyage';
    if (demandeId) return 'cette demande';
    if (messageId) return 'ce message';
    if (utilisateurSignaleId) return 'cet utilisateur';
    return 'cet élément';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Signaler ${getEntityType()}`}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
        {/* Avertissement */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">
              Signalement sérieux uniquement
            </p>
            <p className="text-xs text-amber-700">
              Signalez uniquement les contenus qui violent nos conditions d&apos;utilisation. 
              Les signalements abusifs peuvent entraîner des sanctions sur votre compte.
            </p>
          </div>
        </div>

        {/* Motif */}
        <div>
          <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-2">
            Motif du signalement <span className="text-error">*</span>
          </label>
          <select
            id="motif"
            className="input"
            {...register('motif')}
          >
            {SIGNALEMENT_MOTIFS.map((motif) => (
              <option key={motif.value} value={motif.value}>
                {motif.label}
              </option>
            ))}
          </select>
          {errors.motif && (
            <p className="mt-1 text-sm text-error">{errors.motif.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description détaillée <span className="text-error">*</span>
          </label>
          <textarea
            id="description"
            rows={6}
            className="input"
            placeholder="Décrivez en détail la raison de votre signalement (minimum 20 caractères)..."
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Minimum 20 caractères, maximum 1000 caractères
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Envoyer le signalement
          </Button>
        </div>
      </form>
    </Modal>
  );
}