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

  /**
   * Facture PDF d'une transaction (Lot N4) - generee a la volee cote backend si besoin
   */
  async downloadInvoice(id: number): Promise<Blob> {
    const { data } = await apiClient.get(endpoints.transactions.invoice(id), {
      responseType: 'blob',
    });
    return data;
  },
};
