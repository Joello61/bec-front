/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useDemandeStore } from '@/lib/store';
import { demandesApi } from '@/lib/api/demandes';
import type { DemandeFilters, VoyageWithScore } from '@/types';

/**
 * Hook pour charger et gérer les demandes
 */
export function useDemandes(page = 1, limit = 10, filters?: DemandeFilters) {
  const demandes = useDemandeStore((state) => state.demandes);
  const pagination = useDemandeStore((state) => state.pagination);
  const isLoading = useDemandeStore((state) => state.isLoading);
  const error = useDemandeStore((state) => state.error);
  const fetchDemandes = useDemandeStore((state) => state.fetchDemandes);

  // ✅ Stabiliser filters avec useMemo
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchDemandes(page, limit, stableFilters);
  }, [page, limit, stableFilters, fetchDemandes]);

  // ✅ Stabiliser refetch avec useCallback
  const refetch = useCallback(() => {
    fetchDemandes(page, limit, stableFilters);
  }, [page, limit, stableFilters, fetchDemandes]);

  return {
    demandes,
    pagination,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour une demande spécifique
 */
export function useDemande(id: number) {
  const currentDemande = useDemandeStore((state) => state.currentDemande);
  const isLoading = useDemandeStore((state) => state.isLoading);
  const error = useDemandeStore((state) => state.error);
  const fetchDemande = useDemandeStore((state) => state.fetchDemande);

  useEffect(() => {
    if (id) {
      fetchDemande(id);
    }
  }, [id, fetchDemande]);

  // ✅ Stabiliser refetch avec useCallback
  const refetch = useCallback(() => {
    fetchDemande(id);
  }, [id, fetchDemande]);

  return {
    demande: currentDemande,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour les actions CRUD sur les demandes
 */
export function useDemandeActions() {
  const createDemande = useDemandeStore((state) => state.createDemande);
  const updateDemande = useDemandeStore((state) => state.updateDemande);
  const updateStatus = useDemandeStore((state) => state.updateStatus);
  const deleteDemande = useDemandeStore((state) => state.deleteDemande);
  const isLoading = useDemandeStore((state) => state.isLoading);
  const error = useDemandeStore((state) => state.error);
  const clearError = useDemandeStore((state) => state.clearError);

  return {
    createDemande,
    updateDemande,
    updateStatus,
    deleteDemande,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook pour les demandes d'un utilisateur
 */
export function useUserDemandes(userId?: number) {
  const mesDemandes = useDemandeStore((state) => state.mesDemandes);
  const isLoading = useDemandeStore((state) => state.isLoading);
  const error = useDemandeStore((state) => state.error);
  const fetchUserDemandes = useDemandeStore((state) => state.fetchUserDemandes);

  useEffect(() => {
    if (userId != null) {
      fetchUserDemandes(userId);
    }
  }, [userId, fetchUserDemandes]);

  // ✅ Stabiliser refetch avec useCallback
  const refetch = useCallback(() => {
    if (userId != null) {
      fetchUserDemandes(userId);
    }
  }, [userId, fetchUserDemandes]);

  return {
    mesDemandes,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les voyages correspondants à une demande
 */
export function useMatchingVoyages(demandeId?: number) {
  const [voyages, setVoyages] = useState<VoyageWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Stabiliser fetchMatchingVoyages avec useCallback
  const fetchMatchingVoyages = useCallback(async () => {
    if (demandeId == null) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await demandesApi.getMatchingVoyages(demandeId);
      setVoyages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des voyages correspondants');
    } finally {
      setIsLoading(false);
    }
  }, [demandeId]);

  useEffect(() => {
    fetchMatchingVoyages();
  }, [fetchMatchingVoyages]);

  return {
    voyages,
    isLoading,
    error,
    refetch: fetchMatchingVoyages,
  };
}