import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import { avisApi } from '../avis';
import apiClient from '../client';

describe('avisApi.create - contrat', () => {
  it('envoie un avis vers POST /avis avec le payload fourni', async () => {
    const payload = { cibleId: 3, note: 5 };
    await avisApi.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/avis', payload);
  });
});
