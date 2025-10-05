'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { ChangePasswordForm } from '@/components/forms';
import { useAuth } from '@/lib/hooks';
import type { ChangePasswordFormData } from '@/lib/validations';
import { useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { changePassword } = useAuth();
  const toast = useToast();

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      
      toast.success('Mot de passe modifié avec succès !');
      
      setTimeout(() => {
        router.push(ROUTES.PROFILE);
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Link href={ROUTES.PROFILE}>
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Retour aux profil
            </Button>
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Changer le mot de passe
              </h1>
              <p className="text-gray-600 mt-1">
                Assurez-vous de choisir un mot de passe fort et sécurisé
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          <ChangePasswordForm 
            onSubmit={handleChangePassword}
            onCancel={() => router.push(ROUTES.SETTINGS)}
          />

          {/* Recommandations de sécurité */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              Recommandations de sécurité
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Utilisez au moins 8 caractères avec des majuscules, minuscules et chiffres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>N&apos;utilisez pas le même mot de passe que pour d&apos;autres sites</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Changez votre mot de passe régulièrement (tous les 3-6 mois)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Ne partagez jamais votre mot de passe avec qui que ce soit</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}