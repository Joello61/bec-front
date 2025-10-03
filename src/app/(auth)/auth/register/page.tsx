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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast()

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      // Rediriger vers login après inscription
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  const benefits = [
    { icon: CheckCircle, text: 'Inscription 100% gratuite', description: 'Aucun frais caché' },
    { icon: Users, text: 'Communauté de confiance', description: 'Des milliers d\'utilisateurs vérifiés' },
    { icon: Globe, text: 'Transport international', description: 'Vers toutes les destinations' },
    { icon: TrendingUp, text: 'Économisez jusqu\'à 70%', description: 'Par rapport aux services classiques' }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Colonne gauche - Formulaire */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center"
          >
            Créer un compte
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 text-center"
          >
            Rejoignez la communauté Bagage Express
          </motion.p>
        </div>

        {/* Card du formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-2xl opacity-50" />
          
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <RegisterForm onSubmit={handleRegister} />
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
          <Link href={ROUTES.TERMS} className="text-primary hover:text-primary-dark transition-colors font-medium">
            Conditions d&apos;utilisation
          </Link>{' '}
          et notre{' '}
          <Link href={ROUTES.PRIVACY} className="text-primary hover:text-primary-dark transition-colors font-medium">
            Politique de confidentialité
          </Link>
        </motion.div>
      </motion.div>

      {/* Colonne droite - Image et benefits (cachée sur mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="hidden lg:block"
      >
        {/* Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/images/auth/register.jpg"
            alt="Inscription Bagage Express"
            width={750}
            height={400}
            className="w-full h-[400px] object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
          
          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className='bg-primary/45 backdrop-blur-sm rounded-xl p-3 shadow-lg'>
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
                  <h4 className="font-semibold text-gray-900 mb-1">{benefit.text}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}