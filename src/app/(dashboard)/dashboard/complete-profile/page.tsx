'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCheck, CheckCircle } from 'lucide-react';
import CompleteProfileForm from '@/components/forms/CompleteProfileForm';
import VerificationModal from '@/components/auth/VerificationModal';
import { useAuth } from '@/lib/hooks';
import { useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import type { CompleteProfileFormData } from '@/lib/validations';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, completeProfile } = useAuth();
  const toast = useToast();

  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Si pas authentifié, rediriger vers login
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Si profil déjà complet, rediriger vers dashboard
    if (user.isProfileComplete) {
      router.push(ROUTES.EXPLORE);
    }
  }, [user, router]);

  const handleSubmit = async (data: CompleteProfileFormData) => {
    try {
      const response = await completeProfile(data);
      
      // Stocker le numéro pour la modale
      setPhoneNumber(data.telephone);
      
      if (response.smsVerificationRequired) {
        // Mode PRODUCTION : Afficher la modale de vérification SMS
        toast.success('Profil complété ! Vérifiez votre téléphone.');
        setShowPhoneVerification(true);
      } else {
        // Mode DEV : Téléphone auto-vérifié, rediriger directement vers EXPLORE
        toast.success('Profil complété avec succès !');
        setTimeout(() => {
          router.push(ROUTES.EXPLORE);
        }, 1000);
      }
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la complétion du profil');
    }
  };

  const handlePhoneVerified = () => {
    toast.success('Téléphone vérifié ! Profil complet.');
    
    // Rediriger vers le dashboard
    setTimeout(() => {
      router.push(ROUTES.EXPLORE);
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <UserCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complétez votre profil
          </h1>
          <p className="text-gray-600">
            Quelques informations supplémentaires pour sécuriser votre compte
          </p>
        </div>

        {/* Étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="text-sm font-medium text-gray-700">Email vérifié</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-primary">Compléter profil</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Téléphone vérifié</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <CompleteProfileForm onSubmit={handleSubmit} />
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Pourquoi ces informations ?</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Vérification de votre identité pour la sécurité</li>
                <li>• Localisation pour trouver des voyages/demandes près de chez vous</li>
                <li>• Contact pour les notifications importantes</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modale de vérification téléphone (uniquement si SMS activé) */}
      {showPhoneVerification && (
        <VerificationModal
          isOpen={showPhoneVerification}
          onClose={() => setShowPhoneVerification(false)}
          type="phone"
          contactInfo={phoneNumber}
          onSuccess={handlePhoneVerified}
        />
      )}
    </div>
  );
}