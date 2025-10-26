/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { useAvisStore } from '@/lib/store';

/**
 * Hook pour charger les avis d'un utilisateur avec statistiques
 */
export function useUserAvis(userId?: number) {
  const avisWithStats = useAvisStore((state) => state.avisWithStats);
  const isLoading = useAvisStore((state) => state.isLoading);
  const error = useAvisStore((state) => state.error);
  const fetchUserAvis = useAvisStore((state) => state.fetchUserAvis);

  useEffect(() => {
    if (userId) {
      fetchUserAvis(userId);
    }
  }, [userId]);

  const refetch = useCallback(() => {
      if (userId != null) {
        fetchUserAvis(userId);
      }
    }, [userId, fetchUserAvis]);

  return {
    avis: avisWithStats?.avis || [],
    stats: avisWithStats?.stats || null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour les actions CRUD sur les avis
 */
export function useAvisActions() {
  const createAvis = useAvisStore((state) => state.createAvis);
  const updateAvis = useAvisStore((state) => state.updateAvis);
  const deleteAvis = useAvisStore((state) => state.deleteAvis);
  const isLoading = useAvisStore((state) => state.isLoading);
  const error = useAvisStore((state) => state.error);
  const clearError = useAvisStore((state) => state.clearError);

  return {
    createAvis,
    updateAvis,
    deleteAvis,
    isLoading,
    error,
    clearError,
  };
}