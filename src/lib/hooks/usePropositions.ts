/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { usePropositionStore } from '@/lib/store';

/**
 * Hook pour charger les propositions d'un voyage
 */
export function useVoyagePropositions(voyageId?: number) {
  const propositions = usePropositionStore((state) => state.propositions);
  const isLoading = usePropositionStore((state) => state.isLoading);
  const error = usePropositionStore((state) => state.error);
  const fetchPropositionsByVoyage = usePropositionStore((state) => state.fetchPropositionsByVoyage);

  useEffect(() => {
    if (voyageId != null) {
      fetchPropositionsByVoyage(voyageId);
    }
  }, [voyageId]);

  const refetch = useCallback(() => {
    if (voyageId != null) {
      fetchPropositionsByVoyage(voyageId);
    }
  }, [voyageId, fetchPropositionsByVoyage]);

  return {
    propositions,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook pour charger les propositions acceptées d'un voyage
 */
export function useAcceptedPropositions(voyageId?: number) {
  const propositions = usePropositionStore((state) => state.propositions);
  const isLoading = usePropositionStore((state) => state.isLoading);
  const error = usePropositionStore((state) => state.error);
  const fetchAcceptedByVoyage = usePropositionStore((state) => state.fetchAcceptedByVoyage);

  useEffect(() => {
    if (voyageId != null) {
      fetchAcceptedByVoyage(voyageId);
    }
  }, [voyageId]);

  return {
    propositions,
    isLoading,
    error,
    refetch: voyageId != null ? () => fetchAcceptedByVoyage(voyageId) : async () => {},
  };
}

/**
 * Hook pour charger mes propositions envoyées
 */
export function useMyPropositionsSent() {
  const propositions = usePropositionStore((state) => state.myPropositionsSent);
  const isLoading = usePropositionStore((state) => state.isLoading);
  const error = usePropositionStore((state) => state.error);
  const fetchMyPropositionsSent = usePropositionStore((state) => state.fetchMyPropositionsSent);

  useEffect(() => {
    fetchMyPropositionsSent();
  }, []);

  return {
    propositions,
    isLoading,
    error,
    refetch: fetchMyPropositionsSent,
  };
}

/**
 * Hook pour charger mes propositions reçues
 */
export function useMyPropositionsReceived() {
  const propositions = usePropositionStore((state) => state.myPropositionsReceived);
  const isLoading = usePropositionStore((state) => state.isLoading);
  const error = usePropositionStore((state) => state.error);
  const fetchMyPropositionsReceived = usePropositionStore((state) => state.fetchMyPropositionsReceived);

  useEffect(() => {
    fetchMyPropositionsReceived();
  }, []);

  return {
    propositions,
    isLoading,
    error,
    refetch: fetchMyPropositionsReceived,
  };
}

/**
 * Hook pour le compteur de propositions en attente
 */
export function usePendingPropositionsCount() {
  const count = usePropositionStore((state) => state.pendingCount);
  const fetchPendingCount = usePropositionStore((state) => state.fetchPendingCount);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  return {
    count,
    refetch: fetchPendingCount,
  };
}

/**
 * Hook pour les actions CRUD sur les propositions
 */
export function usePropositionActions() {
  const createProposition = usePropositionStore((state) => state.createProposition);
  const respondToProposition = usePropositionStore((state) => state.respondToProposition);
  const isLoading = usePropositionStore((state) => state.isLoading);
  const error = usePropositionStore((state) => state.error);
  const clearError = usePropositionStore((state) => state.clearError);

  return {
    createProposition,
    respondToProposition,
    isLoading,
    error,
    clearError,
  };
}