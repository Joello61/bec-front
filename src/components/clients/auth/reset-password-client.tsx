'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import type { ResetPasswordFormData } from '@/lib/validations';
import { useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import { Button } from '@/components/ui';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  const [token, setToken] = useState<string | null>(null);
  const [passwordReset, setPasswordReset] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    
    if (!tokenParam) {
      setTokenValid(false);
      toast.error('Token manquant dans l\'URL');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, toast]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    try {
      await authApi.resetPassword(data);
      setPasswordReset(true);
      toast.success('Mot de passe réinitialisé avec succès !');
      
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 3000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message?.includes('token') || error.message?.includes('expiré')) {
        setTokenValid(false);
      }
      toast.error(error.message || 'Erreur lors de la réinitialisation');
    }
  };

  if (!tokenValid || !token) {
    return (
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle className="w-10 h-10 text-error" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Lien invalide ou expiré
            </h2>
            
            <p className="text-gray-600 mb-8">
              Ce lien de réinitialisation n&apos;est plus valide. Les liens expirent après 1 heure pour des raisons de sécurité.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={ROUTES.FORGOT_PASSWORD}>
                <Button variant="primary">
                  Demander un nouveau lien
                </Button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/auth/login.jpg"
              alt="Erreur"
              width={750}
              height={500}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mot de passe réinitialisé !
            </h2>
            
            <p className="text-gray-600 mb-8">
              Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion...
            </p>

            <Link href={ROUTES.LOGIN}>
              <Button variant="primary">
                Se connecter maintenant
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/auth/login.jpg"
              alt="Succès"
              width={750}
              height={500}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-2xl opacity-50" />
          
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <ResetPasswordForm token={token} onSubmit={handleResetPassword} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="hidden lg:block"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/images/auth/login.jpg"
            alt="Réinitialisation"
            width={750}
            height={500}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-primary/45 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                Nouveau départ sécurisé
              </h3>
              <p className="text-white/90">
                Créez un mot de passe fort pour protéger votre compte
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPageClient() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}