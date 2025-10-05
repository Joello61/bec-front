/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store';

/**
 * Hook pour charger et gérer les paramètres utilisateur
 */
export function useSettings() {
  const settings = useSettingsStore((state) => state.settings);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const error = useSettingsStore((state) => state.error);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    // Charger les paramètres au montage du composant
    if (!settings && !isLoading) {
      fetchSettings();
    }
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
  };
}

/**
 * Hook pour les actions de modification des paramètres
 */
export function useSettingsActions() {
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const exportData = useSettingsStore((state) => state.exportData);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const error = useSettingsStore((state) => state.error);
  const clearError = useSettingsStore((state) => state.clearError);

  return {
    updateSettings,
    resetSettings,
    exportData,
    isLoading,
    error,
    clearError,
  };
}