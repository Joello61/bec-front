'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';
import { TriangleAlert } from 'lucide-react';

export default function VerificationBanner() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  if (user.isProfileComplete) return null;

  return (
    <>
      <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border-l-4 border-primary p-4 mb-6 rounded-lg"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary"><TriangleAlert className='w-6 h-6'/></span>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      Profil incomplet
                    </p>
                    <p className="text-sm text-gray-600">
                      Complétez votre profil pour créer des voyages, demandes et envoyer des messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(ROUTES.COMPLETE_PROFILE)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Compléter maintenant
                </button>
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
    </>
  );
}