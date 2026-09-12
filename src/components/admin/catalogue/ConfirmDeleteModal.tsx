'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/common';
import { Modal } from '@/components/ui';

interface ConfirmDeleteModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onSuccess: () => void;
}

/**
 * Confirmation de suppression generique (soft-delete) - contrairement aux modals de
 * suppression existants (DeleteUserModal, DeleteContentModal), la suppression d'un
 * element de catalogue n'a pas de semantique de motif/raison a saisir.
 */
export default function ConfirmDeleteModal({ title, description, onClose, onConfirm, onSuccess }: ConfirmDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      toast.success('Suppression effectuée avec succès');
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
