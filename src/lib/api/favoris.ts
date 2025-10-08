import apiClient from './client';
import { endpoints } from './endpoints';
import type { Favori } from '@/types';

export const favorisApi = {
  async list(): Promise<Favori[]> {
    const response = await apiClient.get<Favori[]>(endpoints.favoris.list);
    return response.data;
  },

  async getVoyages(): Promise<Favori[]> {
    const response = await apiClient.get<Favori[]>(endpoints.favoris.voyages);
    return response.data;
  },

  async getDemandes(): Promise<Favori[]> {
    const response = await apiClient.get<Favori[]>(endpoints.favoris.demandes);
    return response.data;
  },

  async addVoyage(voyageId: number): Promise<Favori> {
    const response = await apiClient.post<Favori>(endpoints.favoris.addVoyage(voyageId));
    return response.data;
  },

  async addDemande(demandeId: number): Promise<Favori> {
    const response = await apiClient.post<Favori>(endpoints.favoris.addDemande(demandeId));
    return response.data;
  },

  async remove(id: number, type: 'voyage' | 'demande'): Promise<void> {
    await apiClient.delete(endpoints.favoris.remove(id, type));
  },
};