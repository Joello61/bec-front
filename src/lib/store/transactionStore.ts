import { create } from 'zustand';

import { transactionsApi } from '@/lib/api/transactions';
import type { PaginationMeta, Transaction } from '@/types';

import { createAsyncAction } from './createAsyncAction';

interface TransactionState {
  transactions: Transaction[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;

  fetchMine: (page?: number, limit?: number) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchMine: (page = 1, limit = 20) =>
    createAsyncAction(set, async () => {
      const response = await transactionsApi.getMine(page, limit);
      set({ transactions: response.data, pagination: response.pagination, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement de vos transactions' }),

  clearError: () => set({ error: null }),
}));
