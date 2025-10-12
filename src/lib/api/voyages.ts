import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  Voyage, 
  CreateVoyageInput, 
  UpdateVoyageInput, 
  VoyageFilters,
  VoyageStatut,
  PaginatedResponse,
  DemandeWithScore
} from '@/types';

export const voyagesApi = {
  async list(page = 1, limit = 10, filters?: VoyageFilters): Promise<PaginatedResponse<Voyage>> {
    const response = await apiClient.get<PaginatedResponse<Voyage>>(endpoints.voyages.list, {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  async show(id: number): Promise<Voyage> {
    const response = await apiClient.get<Voyage>(endpoints.voyages.show(id));
    return response.data;
  },

  async create(data: CreateVoyageInput): Promise<Voyage> {
    const response = await apiClient.post<Voyage>(endpoints.voyages.create, data);
    return response.data;
  },

  async update(id: number, data: UpdateVoyageInput): Promise<Voyage> {
    const response = await apiClient.put<Voyage>(endpoints.voyages.update(id), data);
    return response.data;
  },

  async updateStatus(id: number, statut: VoyageStatut): Promise<Voyage> {
    const response = await apiClient.patch<Voyage>(endpoints.voyages.updateStatus(id), { statut });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.voyages.delete(id));
  },

  async byUser(userId: number): Promise<Voyage[]> {
    const response = await apiClient.get<Voyage[]>(endpoints.voyages.byUser(userId));
    return response.data;
  },

  /**
   * Récupérer les demandes correspondantes à un voyage (avec scoring)
   * ⚠️ Les montants sont automatiquement convertis dans la devise de l'utilisateur
   */
  async getMatchingDemandes(id: number): Promise<DemandeWithScore[]> {
    const response = await apiClient.get<DemandeWithScore[]>(endpoints.voyages.matchingDemandes(id));
    return response.data;
  },
};