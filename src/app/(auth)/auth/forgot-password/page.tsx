'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import type { ForgotPasswordFormData } from '@/lib/validations';
import { useToast } from '@/components/common';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

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

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const toast = useToast();

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data);
      setSentEmail(data.email);
      setEmailSent(true);
      toast.success('Email envoyé avec succès !');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi');
    }
  };

  if (emailSent) {
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
              Email envoyé !
            </h2>
            
            <p className="text-gray-600 mb-2">
              Nous avons envoyé un lien de réinitialisation à :
            </p>
            
            <p className="text-primary font-semibold mb-6">
              {sentEmail}
            </p>
            
            <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-info" />
                Prochaines étapes
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 ml-7">
                <li>1. Vérifiez votre boîte de réception</li>
                <li>2. Cliquez sur le lien dans l&apos;email</li>
                <li>3. Créez votre nouveau mot de passe</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500">
              Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                réessayez
              </button>
            </p>
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
              alt="Réinitialisation"
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
            <ForgotPasswordForm onSubmit={handleForgotPassword} />
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
            alt="Mot de passe oublié"
            width={750}
            height={500}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-primary/45 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                Récupération sécurisée
              </h3>
              <p className="text-white/90">
                Recevez un lien de réinitialisation par email en toute sécurité
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}