import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { patch: vi.fn().mockResolvedValue({ data: {} }) },
}));

import apiClient from '../client';
import { settingsApi } from '../settings';

describe('settingsApi.update - contrat (PATCH partiel)', () => {
  it('envoie la mise a jour vers PATCH /settings avec uniquement les champs fournis', async () => {
    const payload = { showEmail: false, langue: 'fr' as const };
    await settingsApi.update(payload);

    expect(apiClient.patch).toHaveBeenCalledWith('/settings', payload);
  });
});
