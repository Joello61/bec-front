import { create } from 'zustand';

import { settingsApi } from '@/lib/api/settings';
import type { ExportedUserData, UpdateSettingsInput, UserSettings } from '@/types';

import { createAsyncAction } from './createAsyncAction';

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

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: () => {
    if (get().isLoading || get().settings) {
      return Promise.resolve();
    }

    return createAsyncAction(set, async () => {
      const settings = await settingsApi.get();
      set({ settings, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des paramètres' });
  },

  updateSettings: (data) =>
    createAsyncAction(set, async () => {
      const settings = await settingsApi.update(data);
      set({ settings, isLoading: false });
    }, { fallbackError: 'Erreur lors de la mise à jour des paramètres', rethrow: true }),

  resetSettings: () =>
    createAsyncAction(set, async () => {
      const settings = await settingsApi.reset();
      set({ settings, isLoading: false });
    }, { fallbackError: 'Erreur lors de la réinitialisation des paramètres', rethrow: true }),

  exportData: () =>
    createAsyncAction(set, async () => {
      const data = await settingsApi.exportData();
      set({ isLoading: false });
      return data;
    }, { fallbackError: "Erreur lors de l'export des données", rethrow: true }),

  clearError: () => set({ error: null }),
}));
