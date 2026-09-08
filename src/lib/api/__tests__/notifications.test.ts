import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import apiClient from '../client';
import { notificationsApi } from '../notifications';

describe('notificationsApi.markAsRead - contrat', () => {
  it('marque une notification comme lue vers POST /notifications/{id}/mark-read', async () => {
    await notificationsApi.markAsRead(9);

    expect(apiClient.post).toHaveBeenCalledWith('/notifications/9/mark-read');
  });
});
