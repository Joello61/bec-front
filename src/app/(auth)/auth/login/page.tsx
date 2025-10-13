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
import OAuthButtons from '@/components/auth/OAuthButtons';
import { useAuthStore } from '@/lib/store';

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
  const toast = useToast();

  // ==================== LOGIN MODIFIÉ ====================
  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
      
      // ✅ Si on arrive ici = email vérifié + JWT créé
      const user = useAuthStore.getState().user;
      
      toast.success('Connexion réussie !');
      
      // ==================== VÉRIFIER PROFIL COMPLET ====================
      if (!user?.isProfileComplete) {
        // Profil incomplet → Redirection complete-profile
        setTimeout(() => {
          router.push(ROUTES.COMPLETE_PROFILE);
        }, 500);
        return;
      }
      
      // Profil complet → Dashboard
      setTimeout(() => {
        router.push(ROUTES.EXPLORE);
      }, 500);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // ==================== EMAIL NON VÉRIFIÉ ====================
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        toast.error('Veuillez vérifier votre email avant de vous connecter');
        setTimeout(() => {
          router.push(ROUTES.VERIFY_EMAIL);
        }, 1000);
        return;
      }
      
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
        {/* Card du formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-2xl opacity-50" />
          
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <LoginForm onSubmit={handleLogin}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6"
              >
                <OAuthButtons />
                <div className="relative mt-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Ou continuez avec
                    </span>
                  </div>
                </div>
              </motion.div>
            </LoginForm>
          </div>
        </motion.div>
      </motion.div>

      {/* Colonne droite - Image et features */}
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
            alt="Connexion CoBage"
            width={750}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent" />
          {/* Overlay content */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <div className="bg-primary/55 backdrop-blur-sm rounded-xl p-3 shadow-lg">
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