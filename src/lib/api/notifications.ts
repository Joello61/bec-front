import apiClient from './client';
import { endpoints } from './endpoints';
import type { Notification, ApiResponse } from '@/types';

export const notificationsApi = {
  async list(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(endpoints.notifications.list);
    return response.data;
  },

  async getUnread(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(endpoints.notifications.unread);
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(endpoints.notifications.unreadCount);
    return response.data.count || 0;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.post(endpoints.notifications.markRead(id));
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post(endpoints.notifications.markAllRead);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(endpoints.notifications.delete(id));
  },
};