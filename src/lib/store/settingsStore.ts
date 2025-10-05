/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { settingsApi } from '@/lib/api/settings';
import type { UserSettings, UpdateSettingsInput, ExportedUserData } from '@/types';

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (data: UpdateSettingsInput) => Promise<void>;
  resetSettings: () => Promise<void>;
  exportData: () => Promise<ExportedUserData>;
  clearError: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsApi.get();
      set({ settings, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des paramètres', 
        isLoading: false 
      });
    }
  },

  updateSettings: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsApi.update(data);
      set({ settings, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la mise à jour des paramètres', 
        isLoading: false 
      });
      throw error;
    }
  },

  resetSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsApi.reset();
      set({ settings, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la réinitialisation des paramètres', 
        isLoading: false 
      });
      throw error;
    }
  },

  exportData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await settingsApi.exportData();
      set({ isLoading: false });
      return data;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de l\'export des données', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));