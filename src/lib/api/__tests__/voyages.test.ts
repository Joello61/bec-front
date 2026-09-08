import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import apiClient from '../client';
import { voyagesApi } from '../voyages';

describe('voyagesApi.create - contrat (formulaire critique, CLAUDE.md)', () => {
  it('envoie une creation de voyage vers POST /voyages avec le payload fourni', async () => {
    const payload = {
      villeDepart: 'Douala',
      villeArrivee: 'Paris',
      dateDepart: '2027-01-10',
      dateArrivee: '2027-01-11',
      poidsDisponible: 20,
      prixParKilo: 15,
      commissionProposeePourUnBagage: 5000,
    };

    await voyagesApi.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/voyages', payload);
  });
});
