import apiClient from './client';
import { endpoints } from './endpoints';
import type { 
  AddressModificationInfo, 
  UpdateAddressInput, 
  UpdateAddressResponse 
} from '@/types/address';

export const addressApi = {
  /**
   * Récupère les informations sur la possibilité de modifier l'adresse
   */
  async getModificationInfo(): Promise<AddressModificationInfo> {
    const response = await apiClient.get<AddressModificationInfo>(
      endpoints.users.addressModificationInfo
    );
    return response.data;
  },

  /**
   * Met à jour l'adresse de l'utilisateur (contrainte 6 mois)
   */
  async updateAddress(data: UpdateAddressInput): Promise<UpdateAddressResponse> {
    const response = await apiClient.put<UpdateAddressResponse>(
      endpoints.users.updateAddress,
      data
    );
    return response.data;
  },
};