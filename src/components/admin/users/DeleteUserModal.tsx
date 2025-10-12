'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui';
import { useAdmin } from '@/lib/hooks';
import { useToast } from '@/components/common';
import type { User } from '@/types';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteUserModal({ user, onClose, onSuccess }: DeleteUserModalProps) {
  const [reason, setReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteUser } = useAdmin();
  const toast = useToast();

  const confirmationText = `SUPPRIMER ${user.email}`;
  const isConfirmed = confirmation === confirmationText;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmed) {
      toast.error('Veuillez confirmer la suppression');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('La raison doit contenir au moins 10 caractères');
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteUser(user.id, reason);
      toast.success('Utilisateur supprimé avec succès');
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
            <h2 className="text-xl font-bold text-gray-900">Supprimer le compte</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-red-900 mb-2">
            ⚠️ Action irréversible
          </p>
          <p className="text-sm text-red-800">
            Cette action supprimera définitivement le compte de l&apos;utilisateur ainsi que
            toutes ses données personnelles conformément au RGPD. Cette opération ne peut
            pas être annulée.
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Utilisateur à supprimer</p>
          <p className="font-semibold text-gray-900">
            {user.prenom} {user.nom}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Raison */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison de la suppression *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Expliquez la raison de la suppression (min. 10 caractères)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Cette raison sera conservée dans les logs d&apos;administration
            </p>
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation *
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Pour confirmer, tapez exactement :{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-error font-mono">
                {confirmationText}
              </code>
            </p>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Tapez ici pour confirmer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Actions */}
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
              type="submit"
              disabled={isSubmitting || !isConfirmed || reason.trim().length < 10}
              className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Suppression...' : 'Supprimer définitivement'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}