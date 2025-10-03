'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Shield, Zap, Users } from 'lucide-react';
import { LoginForm } from '@/components/forms';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import type { LoginFormData } from '@/lib/validations';
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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast()

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Connexion réussie !');
      router.push(ROUTES.DASHBOARD);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    }
  };

  const features = [
    { icon: Shield, description: 'Données protégées' },
    { icon: Zap, description: 'Connexion rapide' },
    { icon: Users, description: 'Communauté active' }
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
            Bon retour !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 text-center"
          >
            Connectez-vous pour accéder à votre compte
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
            <LoginForm onSubmit={handleLogin} />
          </div>
        </motion.div>
      </motion.div>

      {/* Colonne droite - Image et features (cachée sur mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="hidden lg:block"
      >
        {/* Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/images/auth/login.jpg"
            alt="Connexion Bagage Express"
            width={750}
            height={400}
            className="w-full h-[400px] object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
          
          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-primary/45 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                Transportez vos colis en toute confiance
              </h3>
              <p className="text-white/90 text-center">
                Connectez-vous avec des voyageurs de confiance partout dans le monde
              </p>
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-4">
          <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6'>
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}