import { useAuth } from "@/lib/hooks";
import { ROUTES } from "@/lib/utils/constants";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { useToast } from "../common";
import { Route } from "next";

export default function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchMeAndGet } = useAuth();
  const toast = useToast();
  const hasRun = useRef(false);
  const redirectTo = (searchParams.get('redirect') || ROUTES.EXPLORE) as Route;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
 
    const handleCallback = async () => {
      const error = searchParams.get('error');
      
      if (error) {
        toast.error('Erreur lors de l\'authentification OAuth');
        router.replace(ROUTES.LOGIN);
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
          router.replace(ROUTES.COMPLETE_PROFILE);
          return;
        }
        
        // Profil complet → Dashboard
        router.replace(redirectTo);
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors de la récupération des données');
        router.replace(ROUTES.LOGIN);
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