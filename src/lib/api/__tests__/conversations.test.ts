import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { message: 'ok', count: 3 } }),
  },
}));

import apiClient from '../client';
import { conversationsApi } from '../conversations';

describe('conversationsApi.markAsRead - contrat', () => {
  it('marque une conversation comme lue et ne renvoie que le compteur (pas le message serveur)', async () => {
    const result = await conversationsApi.markAsRead(4);

    expect(apiClient.post).toHaveBeenCalledWith('/conversations/4/mark-read');
    expect(result).toEqual({ count: 3 });
  });
});
