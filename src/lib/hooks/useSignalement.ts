/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSignalementStore } from '@/lib/store';

/**
 * Hook pour charger les signalements avec pagination
 */
export function useSignalements(page = 1, limit = 10, statut?: string) {
  const signalements = useSignalementStore((state) => state.signalements);
  const pagination = useSignalementStore((state) => state.pagination);
  const isLoading = useSignalementStore((state) => state.isLoading);
  const error = useSignalementStore((state) => state.error);
  const fetchSignalements = useSignalementStore((state) => state.fetchSignalements);

  useEffect(() => {
    fetchSignalements(page, limit, statut);
  }, [page, limit, statut]);

  return {
    signalements,
    pagination,
    isLoading,
    error,
    refetch: () => fetchSignalements(page, limit, statut),
  };
}

export function useMesSignalements(page = 1, limit = 10, statut?: string) {
  const mesSignalements = useSignalementStore((state) => state.mesSignalements);
  const pagination = useSignalementStore((state) => state.pagination);
  const isLoading = useSignalementStore((state) => state.isLoading);
  const error = useSignalementStore((state) => state.error);
  const fetchMesSignalements = useSignalementStore((state) => state.fetchMesSignalements);

  useEffect(() => {
    fetchMesSignalements(page, limit, statut);
  }, [page, limit, statut]);

  return {
    mesSignalements,
    pagination,
    isLoading,
    error,
    refetch: () => fetchMesSignalements(page, limit, statut),
  };
}

/**
 * Hook pour les actions sur les signalements
 */
export function useSignalementActions() {
  const createSignalement = useSignalementStore((state) => state.createSignalement);
  const processSignalement = useSignalementStore((state) => state.processSignalement);
  const isLoading = useSignalementStore((state) => state.isLoading);
  const error = useSignalementStore((state) => state.error);
  const clearError = useSignalementStore((state) => state.clearError);

  return {
    createSignalement,
    processSignalement,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook pour le compteur de signalements en attente
 */
export function usePendingSignalements() {
  const pendingCount = useSignalementStore((state) => state.pendingCount);
  const fetchPendingCount = useSignalementStore((state) => state.fetchPendingCount);

  useEffect(() => {
    fetchPendingCount();
    
    // Rafraîchir toutes les 60 secondes
    const interval = setInterval(fetchPendingCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    pendingCount,
    refetch: fetchPendingCount,
  };
}