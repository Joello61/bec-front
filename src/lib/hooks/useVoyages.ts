/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useVoyageStore } from '@/lib/store';
import type { VoyageFilters } from '@/types';

/**
 * Hook pour charger et gérer les voyages
 */
export function useVoyages(page = 1, limit = 10, filters?: VoyageFilters) {
  const voyages = useVoyageStore((state) => state.voyages);
  const pagination = useVoyageStore((state) => state.pagination);
  const isLoading = useVoyageStore((state) => state.isLoading);
  const error = useVoyageStore((state) => state.error);
  const fetchVoyages = useVoyageStore((state) => state.fetchVoyages);

  useEffect(() => {
    fetchVoyages(page, limit, filters);
  }, [page, limit, JSON.stringify(filters)]);

  return {
    voyages,
    pagination,
    isLoading,
    error,
    refetch: () => fetchVoyages(page, limit, filters),
  };
}

/**
 * Hook pour un voyage spécifique
 */
export function useVoyage(id: number) {
  const currentVoyage = useVoyageStore((state) => state.currentVoyage);
  const isLoading = useVoyageStore((state) => state.isLoading);
  const error = useVoyageStore((state) => state.error);
  const fetchVoyage = useVoyageStore((state) => state.fetchVoyage);

  useEffect(() => {
    if (id) {
      fetchVoyage(id);
    }
  }, [id]);

  return {
    voyage: currentVoyage,
    isLoading,
    error,
    refetch: () => fetchVoyage(id),
  };
}

/**
 * Hook pour les actions CRUD sur les voyages
 */
export function useVoyageActions() {
  const createVoyage = useVoyageStore((state) => state.createVoyage);
  const updateVoyage = useVoyageStore((state) => state.updateVoyage);
  const updateStatus = useVoyageStore((state) => state.updateStatus);
  const deleteVoyage = useVoyageStore((state) => state.deleteVoyage);
  const isLoading = useVoyageStore((state) => state.isLoading);
  const error = useVoyageStore((state) => state.error);
  const clearError = useVoyageStore((state) => state.clearError);

  return {
    createVoyage,
    updateVoyage,
    updateStatus,
    deleteVoyage,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook pour les voyages d'un utilisateur
 */
export function useUserVoyages(userId?: number) {
  const voyages = useVoyageStore((state) => state.voyages);
  const isLoading = useVoyageStore((state) => state.isLoading);
  const error = useVoyageStore((state) => state.error);
  const fetchUserVoyages = useVoyageStore((state) => state.fetchUserVoyages);

  useEffect(() => {
    if (userId != null) { // ✅ safe pour null/undefined
      fetchUserVoyages(userId);
    }
  }, [userId, fetchUserVoyages]);

  return {
    voyages,
    isLoading,
    error,
    refetch: userId != null ? () => fetchUserVoyages(userId) : async () => {},
  };
}
