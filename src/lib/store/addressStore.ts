/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { addressApi } from '@/lib/api/address';
import type { 
  Address, 
  AddressModificationInfo, 
  UpdateAddressInput 
} from '@/types/address';

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

  fetchModificationInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const info = await addressApi.getModificationInfo();
      set({ 
        modificationInfo: info,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des informations',
        isLoading: false 
      });
    }
  },

  updateAddress: async (data: UpdateAddressInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await addressApi.updateAddress(data);
      set({ 
        address: response.address,
        isLoading: false 
      });
      
      // Recharger les infos de modification
      const info = await addressApi.getModificationInfo();
      set({ modificationInfo: info });
      
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la mise à jour de l\'adresse',
        isLoading: false 
      });
      throw error;
    }
  },

  setAddress: (address) => set({ address }),

  clearError: () => set({ error: null }),

  reset: () => set({ 
    address: null,
    modificationInfo: null,
    error: null 
  }),
}));