'use client';

import { AlertTriangle, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/common';
import { Button, Input, Modal } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';

interface DeleteAccountModalProps {
  onClose: () => void;
}

const CONFIRMATION_TEXT = 'SUPPRIMER';

export default function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const { user, deleteAccount } = useAuth();
  const toast = useToast();

  // Un compte OAuth pur (Google/Facebook) n'a pas de mot de passe a verifier cote backend.
  const isLocalAccount = !user?.authProvider || user.authProvider === 'local';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfirmed = confirmation === CONFIRMATION_TEXT;
  const canSubmit = isConfirmed && (!isLocalAccount || password.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error('Veuillez compléter le formulaire de confirmation');
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteAccount(isLocalAccount ? password : undefined);
      window.location.replace(ROUTES.HOME);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(message);
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
            <h2 className="text-xl font-bold text-gray-900">Supprimer mon compte</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-red-900 mb-2">Action irréversible</p>
          <p className="text-sm text-red-800">
            Votre compte sera désactivé et vos données personnelles anonymisées. Vos voyages et
            demandes en cours seront annulés. Les messages et avis déjà échangés avec d&apos;autres
            utilisateurs resteront visibles pour eux, sans votre identité.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isLocalAccount && (
            <Input
              label="Mot de passe actuel"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation *
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Pour confirmer, tapez exactement :{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-error font-mono">
                {CONFIRMATION_TEXT}
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

          <div className="flex gap-3">
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
              disabled={!canSubmit}
              className="flex-1"
            >
              Supprimer mon compte
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
