import { AppNotification } from '@/types';
import apiClient from './client';
import { endpoints } from './endpoints';

export const notificationsApi = {
  async list(): Promise<AppNotification[]> {
    const response = await apiClient.get<AppNotification[]>(endpoints.notifications.list);
    return response.data;
  },

  async getUnread(): Promise<AppNotification[]> {
    const response = await apiClient.get<AppNotification[]>(endpoints.notifications.unread);
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(endpoints.notifications.unreadCount);
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