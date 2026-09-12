/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { useSubscriptionStore } from '@/lib/store';

/**
 * Hook pour charger et lire le plan effectif / abonnement actif / usage quota de
 * l'utilisateur courant
 */
export function useSubscription() {
  const mySubscription = useSubscriptionStore((state) => state.mySubscription);
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const error = useSubscriptionStore((state) => state.error);
  const fetchMySubscription = useSubscriptionStore((state) => state.fetchMySubscription);

  useEffect(() => {
    if (!mySubscription && !isLoading) {
      fetchMySubscription();
    }
  }, []);

  return {
    plan: mySubscription?.plan ?? null,
    subscription: mySubscription?.subscription ?? null,
    usage: mySubscription?.usage ?? null,
    isLoading,
    error,
    refetch: fetchMySubscription,
  };
}

/**
 * Hook pour la liste publique des plans (page tarifs / cartes de plans)
 */
export function useSubscriptionPlans() {
  const plans = useSubscriptionStore((state) => state.plans);
  const isLoading = useSubscriptionStore((state) => state.isLoadingPlans);
  const error = useSubscriptionStore((state) => state.error);
  const fetchPlans = useSubscriptionStore((state) => state.fetchPlans);

  useEffect(() => {
    if (!plans && !isLoading) {
      fetchPlans();
    }
  }, []);

  return { plans, isLoading, error, refetch: fetchPlans };
}

/**
 * Hook pour les actions de souscription (checkout/résiliation), sans auto-fetch
 */
export function useSubscriptionActions() {
  const checkout = useSubscriptionStore((state) => state.checkout);
  const cancelSubscription = useSubscriptionStore((state) => state.cancelSubscription);
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const error = useSubscriptionStore((state) => state.error);
  const clearError = useSubscriptionStore((state) => state.clearError);

  return {
    checkout,
    cancelSubscription,
    isLoading,
    error,
    clearError,
  };
}
