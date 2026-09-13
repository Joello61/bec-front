import type { AxiosRequestConfig } from 'axios';

import type { BoostOffer, CheckoutBoostInput, CheckoutSessionResponse } from '@/types';

import apiClient from './client';
import { endpoints } from './endpoints';

export const boostsApi = {
  /**
   * Liste des offres de boost proposées à l'achat (endpoint public). `config` optionnel
   * pour surcharger `baseURL` depuis un Server Component (voir lib/api/server.ts).
   */
  async getOffers(config?: AxiosRequestConfig): Promise<BoostOffer[]> {
    const response = await apiClient.get<BoostOffer[]>(endpoints.boosts.offers, config);
    return response.data;
  },

  /**
   * Démarre un checkout Stripe pour booster un voyage ou une demande
   */
  async checkout(data: CheckoutBoostInput): Promise<CheckoutSessionResponse> {
    const response = await apiClient.post<CheckoutSessionResponse>(endpoints.boosts.checkout, data);
    return response.data;
  },
};
