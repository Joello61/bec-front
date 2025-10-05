import apiClient from './client';
import { endpoints } from './endpoints';
import type { UserSettings, UpdateSettingsInput, ExportedUserData } from '@/types';

export const settingsApi = {
  /**
   * Récupérer les paramètres de l'utilisateur connecté
   */
  async get(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>(endpoints.settings.get);
    return response.data;
  },

  /**
   * Mettre à jour les paramètres (PATCH partiel)
   */
  async update(data: UpdateSettingsInput): Promise<UserSettings> {
    const response = await apiClient.patch<UserSettings>(endpoints.settings.update, data);
    return response.data;
  },

  /**
   * Réinitialiser aux paramètres par défaut
   */
  async reset(): Promise<UserSettings> {
    const response = await apiClient.post<UserSettings>(endpoints.settings.reset);
    return response.data;
  },

  /**
   * Exporter toutes les données utilisateur (RGPD)
   */
  async exportData(): Promise<ExportedUserData> {
    const response = await apiClient.get<ExportedUserData>(endpoints.settings.export);
    return response.data;
  },
};