import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { put: vi.fn().mockResolvedValue({ data: {} }) },
}));

import { addressApi } from '../address';
import apiClient from '../client';

describe('addressApi.updateAddress - contrat (contrainte 6 mois cote backend)', () => {
  it('envoie la mise a jour vers PUT /users/me/address avec le payload fourni', async () => {
    const payload = { pays: 'Cameroun', ville: 'Douala', quartier: 'Akwa' };
    await addressApi.updateAddress(payload);

    expect(apiClient.put).toHaveBeenCalledWith('/users/me/address', payload);
  });
});
