import apiClient from './client';
import { endpoints } from './endpoints';
import type { Conversation, ConversationDetail } from '@/types';

export const conversationsApi = {
  /**
   * Récupère toutes les conversations de l'utilisateur
   */
  async list(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>(endpoints.conversations.list);
    return response.data;
  },

  /**
   * Récupère les détails d'une conversation avec ses messages
   */
  async show(conversationId: number): Promise<ConversationDetail> {
    const response = await apiClient.get<ConversationDetail>(endpoints.conversations.show(conversationId));
    return response.data;
  },

  /**
   * Récupère ou crée une conversation avec un utilisateur
   */
  async withUser(userId: number): Promise<ConversationDetail> {
    const response = await apiClient.get<ConversationDetail>(endpoints.conversations.withUser(userId));
    return response.data;
  },

  /**
   * Marque tous les messages d'une conversation comme lus
   */
  async markAsRead(conversationId: number): Promise<{ count: number }> {
    const response = await apiClient.post<{ message: string; count: number }>(
      endpoints.conversations.markRead(conversationId)
    );
    return { count: response.data.count };
  },

  /**
   * Compte le nombre total de messages non lus
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(endpoints.conversations.unreadCount);
    return response.data.count || 0;
  },

  /**
   * Supprime une conversation
   */
  async delete(conversationId: number): Promise<void> {
    await apiClient.delete(endpoints.conversations.delete(conversationId));
  },
};