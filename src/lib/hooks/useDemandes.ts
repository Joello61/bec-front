/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useDemandeStore } from '@/lib/store';
import type { DemandeFilters } from '@/types';

/**
 * Hook pour charger et gérer les demandes
 */
export function useDemandes(page = 1, limit = 10, filters?: DemandeFilters) {
  const demandes = useDemandeStore((state) => state.demandes);
  const pagination = useDemandeStore((state) => state.pagination);
  const isLoading = useDemandeStore((state) => state.isLoading);
  const error = useDemandeStore((state) => state.error);
  const fetchDemandes = useDemandeStore((state) => state.fetchDemandes);

  useEffect(() => {
    fetchDemandes(page, limit, filters);
  }, [page, limit, JSON.stringify(filters)]);

  return {
    demandes,
    pagination,
    isLoading,
    error,
    refetch: () => fetchDemandes(page, limit, filters),
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
  }, [id]);

  return {
    demande: currentDemande,
    isLoading,
    error,
    refetch: () => fetchDemande(id),
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
export function useUserDemandes(userId: number) {
  const demandes = useDemandeStore((state) => state.demandes);
  const isLoading = useDemandeStore((state) => state.isLoading);
  const error = useDemandeStore((state) => state.error);
  const fetchUserDemandes = useDemandeStore((state) => state.fetchUserDemandes);

  useEffect(() => {
    if (userId) {
      fetchUserDemandes(userId);
    }
  }, [userId]);

  return {
    demandes,
    isLoading,
    error,
    refetch: () => fetchUserDemandes(userId),
  };
}