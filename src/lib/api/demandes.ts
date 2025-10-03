import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  Demande, 
  CreateDemandeInput, 
  UpdateDemandeInput, 
  DemandeFilters,
  DemandeStatut,
  PaginatedResponse 
} from '@/types';

export const demandesApi = {
  async list(page = 1, limit = 10, filters?: DemandeFilters): Promise<PaginatedResponse<Demande>> {
    const response = await apiClient.get<PaginatedResponse<Demande>>(endpoints.demandes.list, {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  async show(id: number): Promise<Demande> {
    const response = await apiClient.get<Demande>(endpoints.demandes.show(id));
    return response.data;
  },

  async create(data: CreateDemandeInput): Promise<Demande> {
    const response = await apiClient.post<Demande>(endpoints.demandes.create, data);
    return response.data;
  },

  async update(id: number, data: UpdateDemandeInput): Promise<Demande> {
    const response = await apiClient.put<Demande>(endpoints.demandes.update(id), data);
    return response.data;
  },

  async updateStatus(id: number, statut: DemandeStatut): Promise<Demande> {
    const response = await apiClient.patch<Demande>(endpoints.demandes.updateStatus(id), { statut });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.demandes.delete(id));
  },

  async byUser(userId: number): Promise<Demande[]> {
    const response = await apiClient.get<Demande[]>(endpoints.demandes.byUser(userId));
    return response.data;
  },
};