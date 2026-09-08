import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import apiClient from '../client';
import { signalementsApi } from '../signalement';

describe('signalementsApi.create - contrat', () => {
  it('envoie un signalement vers POST /signalements avec le payload fourni', async () => {
    const payload = { voyageId: 1, motif: 'spam' as const, description: 'Contenu suspect signale.' };
    await signalementsApi.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/signalements', payload);
  });
});
