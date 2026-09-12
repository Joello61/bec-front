/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { useBoostStore } from '@/lib/store';

/**
 * Hook pour la liste publique des offres de boost (sélection de durée)
 */
export function useBoostOffers() {
  const offers = useBoostStore((state) => state.offers);
  const isLoading = useBoostStore((state) => state.isLoading);
  const error = useBoostStore((state) => state.error);
  const fetchOffers = useBoostStore((state) => state.fetchOffers);

  useEffect(() => {
    if (!offers && !isLoading) {
      fetchOffers();
    }
  }, []);

  return { offers, isLoading, error, refetch: fetchOffers };
}

/**
 * Hook pour l'action de checkout boost, sans auto-fetch
 */
export function useBoostActions() {
  const checkout = useBoostStore((state) => state.checkout);
  const isLoading = useBoostStore((state) => state.isLoading);
  const error = useBoostStore((state) => state.error);
  const clearError = useBoostStore((state) => state.clearError);

  return { checkout, isLoading, error, clearError };
}
