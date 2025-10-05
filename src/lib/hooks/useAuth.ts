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
  
  // Actions principales
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  
  // Actions de vérification
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const verifyPhone = useAuthStore((state) => state.verifyPhone);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  
  // Actions de mot de passe
  const changePassword = useAuthStore((state) => state.changePassword);
  
  // Utilitaires
  const clearError = useAuthStore((state) => state.clearError);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
    fetchMe,
    verifyEmail,
    verifyPhone,
    resendVerification,
    changePassword,
    clearError,
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