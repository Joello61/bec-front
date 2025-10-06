import apiClient from './client';
import { endpoints } from './endpoints';
import type { Message, SendMessageInput } from '@/types';

export const messagesApi = {
  /**
   * Envoie un message (crée automatiquement la conversation si nécessaire)
   */
  async send(data: SendMessageInput): Promise<Message> {
    const response = await apiClient.post<Message>(endpoints.messages.send, data);
    return response.data;
  },

  /**
   * Compte le nombre total de messages non lus
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(endpoints.messages.unreadCount);
    return response.data.count || 0;
  },

  /**
   * Supprime un message
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.messages.delete(id));
  },
};