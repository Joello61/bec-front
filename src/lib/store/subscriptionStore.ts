import { create } from 'zustand';

import { subscriptionsApi } from '@/lib/api/subscriptions';
import type { CheckoutSubscriptionInput, MySubscriptionResponse, SubscriptionPlan } from '@/types';

import { createAsyncAction } from './createAsyncAction';

interface SubscriptionState {
  plans: SubscriptionPlan[] | null;
  mySubscription: MySubscriptionResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPlans: () => Promise<void>;
  fetchMySubscription: () => Promise<void>;
  /** Force un rechargement, contrairement à fetchMySubscription qui n'agit qu'une fois. */
  refreshMySubscription: () => Promise<void>;
  checkout: (data: CheckoutSubscriptionInput) => Promise<string>;
  cancelSubscription: () => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: null,
  mySubscription: null,
  isLoading: false,
  error: null,

  fetchPlans: () => {
    if (get().isLoading || get().plans) {
      return Promise.resolve();
    }

    return createAsyncAction(set, async () => {
      const plans = await subscriptionsApi.getPlans();
      set({ plans, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des plans d\'abonnement' });
  },

  fetchMySubscription: () => {
    if (get().isLoading || get().mySubscription) {
      return Promise.resolve();
    }

    return createAsyncAction(set, async () => {
      const mySubscription = await subscriptionsApi.getMine();
      set({ mySubscription, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement de votre abonnement' });
  },

  refreshMySubscription: () =>
    createAsyncAction(set, async () => {
      const mySubscription = await subscriptionsApi.getMine();
      set({ mySubscription, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement de votre abonnement' }),

  checkout: (data) =>
    createAsyncAction(set, async () => {
      const { checkoutUrl } = await subscriptionsApi.checkout(data);
      set({ isLoading: false });
      return checkoutUrl;
    }, { fallbackError: 'Erreur lors de la création de la session de paiement', rethrow: true }),

  cancelSubscription: () =>
    createAsyncAction(set, async () => {
      await subscriptionsApi.cancel();
      // Le webhook Stripe reste la source de verite - on recharge l'abonnement
      // directement plutot que de deviner l'etat resultant localement.
      const mySubscription = await subscriptionsApi.getMine();
      set({ mySubscription, isLoading: false });
    }, { fallbackError: 'Erreur lors de la résiliation de l\'abonnement', rethrow: true }),

  clearError: () => set({ error: null }),
}));
