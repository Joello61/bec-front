import apiClient from './client';
import { endpoints } from './endpoints';
import type { User, UpdateUserInput, PaginatedResponse, DashboardData, AvatarResponse } from '@/types';

export const usersApi = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(endpoints.users.list, {
      params: { page, limit },
    });
    return response.data;
  },

  async show(id: number): Promise<User> {
    const response = await apiClient.get<User>(endpoints.users.show(id));
    return response.data;
  },

  async updateMe(data: UpdateUserInput): Promise<User> {
    const response = await apiClient.put<User>(endpoints.users.updateMe, data);
    return response.data;
  },

  async search(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(endpoints.users.search, {
      params: { q: query },
    });
    return response.data;
  },

  async dashboard(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>(endpoints.users.dashboard);
    return response.data;
  },

  /**
   * Upload ou remplace l'avatar de l'utilisateur
   * @param file - Fichier image (JPEG, PNG, WebP, max 5MB)
   * @returns URL de l'avatar uploadé
   */
  async uploadAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post<AvatarResponse>(
      endpoints.users.manageAvatar,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Supprime l'avatar de l'utilisateur
   */
  async deleteAvatar(): Promise<AvatarResponse> {
    const formData = new FormData();
    formData.append('deletePhoto', 'true');

    const response = await apiClient.post<AvatarResponse>(
      endpoints.users.manageAvatar,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};