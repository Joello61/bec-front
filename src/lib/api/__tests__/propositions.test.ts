import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

import apiClient from '../client';
import { propositionsApi } from '../propositions';

describe('propositionsApi.create / respond - contrat', () => {
  it('cree une proposition vers POST /propositions/voyage/{voyageId}', async () => {
    const payload = { demandeId: 3, prixParKilo: 12, commissionProposeePourUnBagage: 2000 };
    await propositionsApi.create(7, payload);

    expect(apiClient.post).toHaveBeenCalledWith('/propositions/voyage/7', payload);
  });

  it('repond a une proposition vers PATCH /propositions/{id}/respond', async () => {
    const payload = { action: 'accepter' as const };
    await propositionsApi.respond(42, payload);

    expect(apiClient.patch).toHaveBeenCalledWith('/propositions/42/respond', payload);
  });
});
