'use client';

import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Lock } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { Modal, ModalFooter } from '../ui';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  message = 'Pour consulter les détails, vous devez être connecté(e)'
}: AuthRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push(ROUTES.LOGIN);
  };

  const handleRegister = () => {
    onClose();
    router.push(ROUTES.REGISTER);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      {/* Icône et message */}
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Connexion requise
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>

      <ModalFooter className="flex-col sm:flex-row gap-3">
        {/* Bouton Connexion */}
        <button
          onClick={handleLogin}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-all"
        >
          <LogIn className="w-5 h-5" />
          J&apos;ai déjà un compte
        </button>

        {/* Bouton Inscription */}
        <button
          onClick={handleRegister}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all shadow-md"
        >
          <UserPlus className="w-5 h-5" />
          Créer un compte
        </button>
      </ModalFooter>
    </Modal>
  );
}