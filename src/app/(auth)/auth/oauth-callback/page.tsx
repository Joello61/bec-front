'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { useToast } from '@/components/common';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchMeAndGet } = useAuth();
  const toast = useToast();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
 
    const handleCallback = async () => {
      const error = searchParams.get('error');
      
      if (error) {
        toast.error('Erreur lors de l\'authentification OAuth');
        router.push(ROUTES.LOGIN);
        return;
      }

      try {
        // Récupérer les données utilisateur (JWT déjà dans cookie)
        const user = await fetchMeAndGet();
        
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }
        
        toast.success('Connexion réussie !');
        
        // ==================== VÉRIFIER PROFIL COMPLET ====================
        if (!user.isProfileComplete) {
          // Profil incomplet → Complete profile
          setTimeout(() => {
            router.push(ROUTES.COMPLETE_PROFILE);
          }, 1000);
          return;
        }
        
        // Profil complet → Dashboard
        setTimeout(() => {
          router.push(ROUTES.EXPLORE);
        }, 1000);
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors de la récupération des données');
        router.push(ROUTES.LOGIN);
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <Loader2 className="w-20 h-20 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentification en cours...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous vous connectons
        </p>
      </motion.div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}