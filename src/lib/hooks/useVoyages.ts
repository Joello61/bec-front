/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useVoyageStore } from '@/lib/store';
import { voyagesApi } from '@/lib/api/voyages';
import type { VoyageFilters, Demande } from '@/types';

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
    if (userId != null) {
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

// ==================== NOUVEAU HOOK : MATCHING ====================
/**
 * Hook pour récupérer les demandes correspondantes à un voyage
 */
export function useMatchingDemandes(voyageId?: number) {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchingDemandes = async () => {
    if (voyageId == null) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await voyagesApi.getMatchingDemandes(voyageId);
      setDemandes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des demandes correspondantes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchingDemandes();
  }, [voyageId]);

  return {
    demandes,
    isLoading,
    error,
    refetch: fetchMatchingDemandes,
  };
}