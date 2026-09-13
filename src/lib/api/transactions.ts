import type { PaginatedResponse, Transaction } from '@/types';

import apiClient from './client';
import { endpoints } from './endpoints';

export const transactionsApi = {
  /**
   * Historique paginé des propres transactions de l'utilisateur courant (Lot N3)
   */
  async getMine(page = 1, limit = 20): Promise<PaginatedResponse<Transaction>> {
    const { data } = await apiClient.get<PaginatedResponse<Transaction>>(endpoints.transactions.me, {
      params: { page, limit },
    });
    return data;
  },
};
