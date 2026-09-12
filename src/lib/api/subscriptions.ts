import type {
  CheckoutSessionResponse,
  CheckoutSubscriptionInput,
  MySubscriptionResponse,
  SubscriptionPlan,
} from '@/types';

import apiClient from './client';
import { endpoints } from './endpoints';

export const subscriptionsApi = {
  /**
   * Liste des plans proposés à la souscription (endpoint public)
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlan[]>(endpoints.subscriptions.plans);
    return response.data;
  },

  /**
   * Plan effectif, abonnement actif et usage du quota freemium de l'utilisateur courant
   */
  async getMine(): Promise<MySubscriptionResponse> {
    const response = await apiClient.get<MySubscriptionResponse>(endpoints.subscriptions.me);
    return response.data;
  },

  /**
   * Démarre un checkout Stripe pour un plan payant - retourne l'URL de la page hébergée
   */
  async checkout(data: CheckoutSubscriptionInput): Promise<CheckoutSessionResponse> {
    const response = await apiClient.post<CheckoutSessionResponse>(endpoints.subscriptions.checkout, data);
    return response.data;
  },

  /**
   * Résilie l'abonnement actif à la fin de la période en cours
   */
  async cancel(): Promise<void> {
    await apiClient.post(endpoints.subscriptions.cancel);
  },
};
