import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import apiClient from '../client';
import { demandesApi } from '../demandes';

describe('demandesApi.create - contrat (formulaire critique, CLAUDE.md)', () => {
  it('envoie une creation de demande vers POST /demandes avec le payload fourni', async () => {
    const payload = {
      villeDepart: 'Douala',
      villeArrivee: 'Paris',
      dateLimite: '2027-01-10',
      poidsEstime: 5,
      prixParKilo: 15,
      commissionProposeePourUnBagage: 3000,
      description: 'Un colis fragile a expedier.',
    };

    await demandesApi.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/demandes', payload);
  });
});
