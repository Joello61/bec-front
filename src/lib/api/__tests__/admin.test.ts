import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: undefined }) },
}));

import apiClient from '../client';
import { adminApi } from '../admin';

describe('adminApi.banUser - contrat (mutation sensible, admin uniquement)', () => {
  it('envoie le bannissement vers POST /admin/users/{id}/ban avec le payload fourni', async () => {
    const payload = { reason: 'Comportement abusif repete.', type: 'permanent' as const, notifyUser: true, deleteContent: false };
    await adminApi.banUser(12, payload);

    expect(apiClient.post).toHaveBeenCalledWith('/admin/users/12/ban', payload);
  });
});
