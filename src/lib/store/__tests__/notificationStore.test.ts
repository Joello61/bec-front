import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiError, AppNotification } from '@/types';

vi.mock('@/lib/api/notifications', () => ({
  notificationsApi: {
    list: vi.fn(),
    getUnread: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    delete: vi.fn(),
  },
}));

import { notificationsApi } from '@/lib/api/notifications';
import { useNotificationStore } from '../notificationStore';

const initialState = useNotificationStore.getState();

beforeEach(() => {
  useNotificationStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('notificationStore.fetchUnreadCount', () => {
  it('ne touche pas isLoading/error meme en cas d\'echec (compteur silencieux)', async () => {
    vi.mocked(notificationsApi.getUnreadCount).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await useNotificationStore.getState().fetchUnreadCount();

    expect(useNotificationStore.getState()).toMatchObject({ isLoading: false, error: null });
  });
});

describe('notificationStore.markAsRead', () => {
  it('decremente unreadCount sans toucher isLoading', async () => {
    useNotificationStore.setState({
      notifications: [{ id: 1, lue: false } as AppNotification],
      unreadCount: 1,
    });
    vi.mocked(notificationsApi.markAsRead).mockResolvedValue(undefined);

    await useNotificationStore.getState().markAsRead(1);

    expect(useNotificationStore.getState()).toMatchObject({ unreadCount: 0, isLoading: false });
    expect(useNotificationStore.getState().notifications[0].lue).toBe(true);
  });

  it('absorbe l\'erreur sans relancer', async () => {
    vi.mocked(notificationsApi.markAsRead).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await expect(useNotificationStore.getState().markAsRead(1)).resolves.toBeUndefined();
    expect(useNotificationStore.getState().error).toBe('Erreur');
  });
});

describe('notificationStore.deleteNotification', () => {
  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur' };
    vi.mocked(notificationsApi.delete).mockRejectedValue(apiError);

    await expect(useNotificationStore.getState().deleteNotification(1)).rejects.toBe(apiError);
  });
});
