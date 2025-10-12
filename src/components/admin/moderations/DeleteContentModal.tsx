'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { deleteContentSchema, type DeleteContentFormData } from '@/lib/validations/admin.schema';
import { useToast } from '@/components/common';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteContentModalProps {
  contentType: 'voyage' | 'demande' | 'avis' | 'message';
  contentId: number;
  contentTitle: string;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteContentModal({
  contentType,
  contentId,
  contentTitle,
  onClose,
  onSuccess,
}: DeleteContentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteVoyage, deleteDemande, deleteAvis, deleteMessage } = useAdmin();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeleteContentFormData>({
    resolver: zodResolver(deleteContentSchema),
    defaultValues: {
      motif: 'autre',
      notifyUser: true,
      banUser: false,
      deleteAllUserContent: false,
      severity: 'medium',
    },
  });

  const banUser = watch('banUser');

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'voyage':
        return 'le voyage';
      case 'demande':
        return 'la demande';
      case 'avis':
        return "l'avis";
      case 'message':
        return 'le message';
    }
  };

  const onSubmit = async (data: DeleteContentFormData) => {
    setIsSubmitting(true);
    try {
      switch (contentType) {
        case 'voyage':
          await deleteVoyage(contentId, data);
          break;
        case 'demande':
          await deleteDemande(contentId, data);
          break;
        case 'avis':
          await deleteAvis(contentId, data);
          break;
        case 'message':
          await deleteMessage(contentId, data);
          break;
      }
      toast.success('Contenu supprimé avec succès');
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
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Supprimer {getContentTypeLabel()}
            </h2>
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
          <p className="text-sm text-gray-600 mb-1">Contenu à supprimer</p>
          <p className="font-semibold text-gray-900">{contentTitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif de suppression *
            </label>
            <select
              {...register('motif')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="spam">Spam</option>
              <option value="fraude">Fraude</option>
              <option value="harcelement">Harcèlement</option>
              <option value="contenu_inapproprie">Contenu inapproprié</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Raison détaillée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison détaillée *
            </label>
            <textarea
              {...register('reason')}
              rows={4}
              placeholder="Expliquez en détail la raison de la suppression..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {errors.reason && (
              <p className="text-error text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gravité
            </label>
            <select
              {...register('severity')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="critical">Critique</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('notifyUser')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Notifier l&apos;utilisateur de la suppression
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('banUser')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Bannir également l&apos;utilisateur
              </span>
            </label>

            {banUser && (
              <div className="ml-7">
                <textarea
                  {...register('banReason')}
                  rows={2}
                  placeholder="Raison du bannissement..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                {errors.banReason && (
                  <p className="text-error text-sm mt-1">{errors.banReason.message}</p>
                )}
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('deleteAllUserContent')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Supprimer tous les contenus de cet utilisateur
              </span>
            </label>
          </div>

          {/* Notes internes (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes internes (optionnel)
            </label>
            <textarea
              {...register('internalNotes')}
              rows={2}
              placeholder="Notes pour les autres administrateurs..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Attention :</strong> Cette action est irréversible et sera enregistrée
              dans les logs d&apos;administration.
            </p>
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
              className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Suppression...' : 'Supprimer le contenu'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}