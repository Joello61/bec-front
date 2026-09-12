import { create } from 'zustand';

import { boostsApi } from '@/lib/api/boosts';
import type { BoostOffer, CheckoutBoostInput } from '@/types';

import { createAsyncAction } from './createAsyncAction';

interface BoostState {
  offers: BoostOffer[] | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOffers: () => Promise<void>;
  checkout: (data: CheckoutBoostInput) => Promise<string>;
  clearError: () => void;
}

export const useBoostStore = create<BoostState>((set, get) => ({
  offers: null,
  isLoading: false,
  error: null,

  fetchOffers: () => {
    if (get().isLoading || get().offers) {
      return Promise.resolve();
    }

    return createAsyncAction(set, async () => {
      const offers = await boostsApi.getOffers();
      set({ offers, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des offres de boost' });
  },

  checkout: (data) =>
    createAsyncAction(set, async () => {
      const { checkoutUrl } = await boostsApi.checkout(data);
      set({ isLoading: false });
      return checkoutUrl;
    }, { fallbackError: 'Erreur lors de la création de la session de paiement', rethrow: true }),

  clearError: () => set({ error: null }),
}));
