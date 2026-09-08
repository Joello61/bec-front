import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: { message: 'ok', id: 1 } }) },
}));

import apiClient from '../client';
import { contactsApi } from '../contacts';

describe('contactsApi.create - contrat (formulaire public)', () => {
  it('envoie le message de contact vers POST /contacts/send', async () => {
    const payload = { nom: 'Jean', email: 'jean@example.com', sujet: 'Question', message: 'Bonjour, question.' };
    await contactsApi.create(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/contacts/send', payload);
  });
});
