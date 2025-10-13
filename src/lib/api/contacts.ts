import apiClient from './client';
import { endpoints } from './endpoints';
import type { Contact, CreateContactInput } from '@/types';

interface CreateContactResponse {
  message: string;
  id: number;
}

export const contactsApi = {
  /**
   * Créer un nouveau message de contact (PUBLIC)
   * Rate limité à 5 messages par heure par IP
   */
  async create(data: CreateContactInput): Promise<CreateContactResponse> {
    const response = await apiClient.post<CreateContactResponse>(
      endpoints.contacts.create,
      data
    );
    return response.data;
  },

  /**
   * Lister tous les contacts (ADMIN uniquement)
   */
  async list(): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>(endpoints.contacts.list);
    return response.data;
  },

  /**
   * Voir les détails d'un contact (ADMIN uniquement)
   */
  async show(id: number): Promise<Contact> {
    const response = await apiClient.get<Contact>(endpoints.contacts.show(id));
    return response.data;
  },

  /**
   * Supprimer un contact (ADMIN uniquement)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.contacts.delete(id));
  },
};