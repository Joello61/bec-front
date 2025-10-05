'use client';

import { useState } from 'react';
import { AlertCircle, Mail, Smartphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks';
import { Button } from '@/components/ui';
import VerificationModal from '@/components/auth/VerificationModal';

export default function VerificationBanner() {
  const { user } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [dismissedEmail, setDismissedEmail] = useState(false);
  const [dismissedPhone, setDismissedPhone] = useState(false);

  if (!user) return null;

  const needsEmailVerification = !user.emailVerifie && !dismissedEmail;
  const needsPhoneVerification = user.telephone && !user.telephoneVerifie && !dismissedPhone;

  if (!needsEmailVerification && !needsPhoneVerification) return null;

  return (
    <>
      <AnimatePresence>
        {needsEmailVerification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-warning/10 border-l-4 border-warning p-4 mb-6 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email non vérifié
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Veuillez vérifier votre adresse email <strong>{user.email}</strong> pour accéder à toutes les fonctionnalités.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Mail className="w-4 h-4" />}
                    onClick={() => setShowEmailModal(true)}
                  >
                    Vérifier maintenant
                  </Button>
                  <button
                    onClick={() => setDismissedEmail(true)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Plus tard
                  </button>
                </div>
              </div>

              <button
                onClick={() => setDismissedEmail(true)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {needsPhoneVerification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-info/10 border-l-4 border-info p-4 mb-6 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Smartphone className="w-5 h-5 text-info mt-0.5" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Téléphone non vérifié
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Vérifiez votre numéro <strong>{user.telephone}</strong> pour améliorer la sécurité de votre compte.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Smartphone className="w-4 h-4" />}
                    onClick={() => setShowPhoneModal(true)}
                  >
                    Vérifier maintenant
                  </Button>
                  <button
                    onClick={() => setDismissedPhone(true)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Plus tard
                  </button>
                </div>
              </div>

              <button
                onClick={() => setDismissedPhone(true)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        type="email"
        contactInfo={user.email}
      />

      <VerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        type="phone"
        contactInfo={user.telephone || undefined}
      />
    </>
  );
}