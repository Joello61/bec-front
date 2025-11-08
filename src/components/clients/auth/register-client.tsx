'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { CheckCircle, Users, Globe, TrendingUp } from 'lucide-react';
import { RegisterForm } from '@/components/forms';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import type { RegisterFormData } from '@/lib/validations';
import { useToast } from '@/components/common';
import OAuthButtons from '@/components/auth/OAuthButtons';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function RegisterPageClient() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  // ==================== REGISTER MODIFIÉ ====================
  // Redirection vers verify-email au lieu de login
  const handleRegister = async (data: RegisterFormData) => {
  try {
    const response = await register(data); // <-- récupère la réponse JSON du backend

    // On lit la valeur du flag renvoyé par le backend
    const emailVerificationEnabled = response.emailVerificationEnabled;

    if (emailVerificationEnabled) {
      // Mode PRODUCTION : email de vérification envoyé
      toast.success('Inscription réussie ! Vérifiez votre email.');
      setTimeout(() => {
        router.push(ROUTES.VERIFY_EMAIL);
      }, 1000);
    } else {
      // Mode DEV / PANNE RESEND : auto-vérification
      toast.success('Inscription réussie ! Votre compte est déjà vérifié.');
      setTimeout(() => {
        router.push(ROUTES.LOGIN); // ou le tableau de bord selon ton flow
      }, 1000);
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.message || "Erreur lors de l'inscription");
  }
};

  const benefits = [
    {
      icon: CheckCircle,
      text: 'Inscription 100% gratuite',
      description: 'Aucun frais caché',
    },
    {
      icon: Users,
      text: 'Communauté de confiance',
      description: "Des milliers d'utilisateurs vérifiés",
    },
    {
      icon: Globe,
      text: 'Transport international',
      description: 'Vers toutes les destinations',
    },
    {
      icon: TrendingUp,
      text: "Économisez jusqu'à 70%",
      description: 'Par rapport aux services classiques',
    },
  ];

  return (
    <div>

      {/* Alerte temporaire panne e-mail 
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 px-4 py-3 shadow-sm flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-yellow-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-medium">
          Les emails de vérification sont actuellement retardés à cause d’un incident
          chez notre fournisseur. ⚠️
          <br />
          👉 Nous vous recommandons d’utiliser l’inscription via{' '}
          <span className="font-semibold text-primary">Google</span> pour le moment.
        </p>
      </motion.div>*/}
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Colonne gauche - Formulaire */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full"
      >
        {/* Card du formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-2xl opacity-50" />

          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <RegisterForm onSubmit={handleRegister}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6"
              >
                <OAuthButtons />
                <div className="mt-6">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Ou inscrivez-vous avec
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </RegisterForm>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          En vous inscrivant, vous acceptez nos{' '}
          <Link
            href={ROUTES.TERMS}
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            Conditions d&apos;utilisation
          </Link>{' '}
          et notre{' '}
          <Link
            href={ROUTES.PRIVACY}
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            Politique de confidentialité
          </Link>
        </motion.div>
      </motion.div>

      {/* Colonne droite - Image et benefits */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="hidden lg:block"
      >
        {/* Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/images/auth/register.webp"
            alt="Inscription Co-Bage"
            width={750}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-primary/45 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                Commencez à transporter dès aujourd&apos;hui
              </h3>
              <p className="text-white/90 text-center">
                Une plateforme simple, rapide et sécurisée pour tous vos besoins
              </p>
            </div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {benefit.text}
                  </h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
    </div>
  );
}
