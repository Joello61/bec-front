import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import apiClient from '../client';
import { messagesApi } from '../messages';

describe('messagesApi.send - contrat', () => {
  it('envoie un message vers POST /messages avec le payload fourni', async () => {
    const payload = { destinataireId: 3, contenu: 'Bonjour !' };
    await messagesApi.send(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/messages', payload);
  });
});
