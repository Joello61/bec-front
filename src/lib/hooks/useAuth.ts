import { useAuthStore } from '@/lib/store';

/**
 * Hook simplifié pour accéder aux données d'authentification
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized); 
  const error = useAuthStore((state) => state.error);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  
  // Actions principales
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  
  // Actions de vérification
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const verifyPhone = useAuthStore((state) => state.verifyPhone);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  
  // Actions de profil
  const completeProfile = useAuthStore((state) => state.completeProfile);
  const checkProfileStatus = useAuthStore((state) => state.checkProfileStatus);
  
  // Actions de mot de passe
  const changePassword = useAuthStore((state) => state.changePassword);
  
  // Utilitaires
  const clearError = useAuthStore((state) => state.clearError);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    pendingEmail,
    
    // Actions auth
    login,
    register,
    logout,
    fetchMe,
    
    // Actions vérification
    verifyEmail,
    verifyPhone,
    resendVerification,
    
    // Actions profil
    completeProfile,
    checkProfileStatus,
    
    // Actions mot de passe
    changePassword,
    
    // Utilitaires
    clearError,
    setPendingEmail,
  };
}

/**
 * Hook pour protéger les routes authentifiées
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    canAccess: isAuthenticated && isInitialized,
  };
}

/**
 * Hook pour vérifier si le profil est complet
 * Utile pour rediriger vers /complete-profile si nécessaire
 */
export function useProfileCompletion() {
  const { user, isAuthenticated, checkProfileStatus } = useAuth();
  
  const isProfileComplete = user?.emailVerifie && 
                           user?.telephoneVerifie && 
                           user?.nom && 
                           user?.prenom;

  return {
    isProfileComplete,
    needsEmailVerification: isAuthenticated && !user?.emailVerifie,
    needsPhoneVerification: isAuthenticated && !user?.telephoneVerifie,
    needsProfileCompletion: isAuthenticated && (!user?.nom || !user?.prenom),
    checkProfileStatus,
  };
}

/**
 * Hook pour gérer les erreurs d'authentification spécifiques
 */
export function useAuthError() {
  const { error, clearError } = useAuth();
  
  const isEmailNotVerified = error === 'EMAIL_NOT_VERIFIED';
  const hasError = !!error && error !== 'EMAIL_NOT_VERIFIED';
  const errorMessage = hasError ? error : null;

  return {
    isEmailNotVerified,
    hasError,
    errorMessage,
    clearError,
  };
}