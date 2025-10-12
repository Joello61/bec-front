/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useVoyageStore } from '@/lib/store';
import { voyagesApi } from '@/lib/api/voyages';
import type { VoyageFilters, DemandeWithScore } from '@/types';

/**
 * Hook pour charger et gérer les voyages
 */
export function useVoyages(page = 1, limit = 10, filters?: VoyageFilters) {
  const voyages = useVoyageStore((state) => state.voyages);
  const pagination = useVoyageStore((state) => state.pagination);
  const isLoading = useVoyageStore((state) => state.isLoading);
  const error = useVoyageStore((state) => state.error);
  const fetchVoyages = useVoyageStore((state) => state.fetchVoyages);

  // ✅ Stabiliser filters avec useMemo pour éviter les re-renders inutiles
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchVoyages(page, limit, stableFilters);
  }, [page, limit, stableFilters, fetchVoyages]);

  // ✅ refetch ne dépend que de variables stables
  const refetch = useCallback(() => {
    fetchVoyages(page, limit, stableFilters);
  }, [page, limit, stableFilters, fetchVoyages]);

  return {
    voyages,
    pagination,
    isLoading,
    error,
    refetch
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
  }, [id, fetchVoyage]);

  // ✅ Stabiliser refetch avec useCallback
  const refetch = useCallback(() => {
    fetchVoyage(id);
  }, [id, fetchVoyage]);

  return {
    voyage: currentVoyage,
    isLoading,
    error,
    refetch,
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

  // ✅ Stabiliser refetch avec useCallback
  const refetch = useCallback(() => {
    if (userId != null) {
      fetchUserVoyages(userId);
    }
  }, [userId, fetchUserVoyages]);

  return {
    voyages,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les demandes correspondantes à un voyage
 */
export function useMatchingDemandes(voyageId?: number) {
  const [demandes, setDemandes] = useState<DemandeWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Stabiliser fetchMatchingDemandes avec useCallback
  const fetchMatchingDemandes = useCallback(async () => {
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
  }, [voyageId]); // ✅ Ne dépend que de voyageId

  useEffect(() => {
    fetchMatchingDemandes();
  }, [fetchMatchingDemandes]); // ✅ Maintenant stable grâce à useCallback

  return {
    demandes,
    isLoading,
    error,
    refetch: fetchMatchingDemandes,
  };
}