import { create } from 'zustand';

import { addressApi } from '@/lib/api/address';
import type {
  Address,
  AddressModificationInfo,
  UpdateAddressInput
} from '@/types/address';

import { createAsyncAction } from './createAsyncAction';

interface AddressState {
  address: Address | null;
  modificationInfo: AddressModificationInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchModificationInfo: () => Promise<void>;
  updateAddress: (data: UpdateAddressInput) => Promise<void>;
  setAddress: (address: Address | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  address: null,
  modificationInfo: null,
  isLoading: false,
  error: null,

  fetchModificationInfo: () =>
    createAsyncAction(set, async () => {
      const info = await addressApi.getModificationInfo();
      set({ modificationInfo: info, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des informations' }),

  updateAddress: (data) =>
    createAsyncAction(set, async () => {
      const response = await addressApi.updateAddress(data);
      set({ address: response.address, isLoading: false });

      const info = await addressApi.getModificationInfo();
      set({ modificationInfo: info });
    }, { fallbackError: "Erreur lors de la mise à jour de l'adresse", rethrow: true }),

  setAddress: (address) => set({ address }),

  clearError: () => set({ error: null }),

  reset: () => set({
    address: null,
    modificationInfo: null,
    error: null
  }),
}));
