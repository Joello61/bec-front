import apiClient from './client';
import { endpoints } from './endpoints';
import type { Message, SendMessageInput, Conversation, ApiResponse } from '@/types';

export const messagesApi = {
  async send(data: SendMessageInput): Promise<Message> {
    const response = await apiClient.post<Message>(endpoints.messages.send, data);
    return response.data;
  },

  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>(endpoints.messages.conversations);
    return response.data;
  },

  async getConversation(userId: number): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(endpoints.messages.conversation(userId));
    return response.data;
  },

  async markAsRead(userId: number): Promise<void> {
    await apiClient.post(endpoints.messages.markRead(userId));
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(endpoints.messages.unreadCount);
    return response.data.count || 0;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.messages.delete(id));
  },
};