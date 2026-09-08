import { describe, expect, it, vi, afterEach } from 'vitest';

vi.mock('../client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    get: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

import apiClient from '../client';
import { authApi } from '../auth';

describe('authApi.login / register - contrat', () => {
  it('envoie login sur le bon endpoint avec le payload fourni', async () => {
    await authApi.login({ email: 'user@example.com', password: 'password123' });

    expect(apiClient.post).toHaveBeenCalledWith('/login', { email: 'user@example.com', password: 'password123' });
  });

  it('envoie register sur le bon endpoint avec le payload fourni', async () => {
    const payload = { nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com', password: 'Password1' };
    await authApi.register(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/register', payload);
  });

  it('envoie completeProfile vers /users/me/complete-profile (endpoint partage avec le domaine users)', async () => {
    const payload = { telephone: '+237612345678', pays: 'Cameroun', ville: 'Douala' };
    await authApi.completeProfile(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/users/me/complete-profile', payload);
  });
});

describe('authApi.logout', () => {
  const originalCaches = (globalThis as { caches?: unknown }).caches;

  afterEach(() => {
    (globalThis as { caches?: unknown }).caches = originalCaches;
    vi.restoreAllMocks();
  });

  it('appelle /logout puis purge tout le Cache Storage du navigateur', async () => {
    const deleteMock = vi.fn().mockResolvedValue(true);
    const keysMock = vi.fn().mockResolvedValue(['cache-a', 'cache-b']);
    (globalThis as { caches?: unknown }).caches = { keys: keysMock, delete: deleteMock };

    await authApi.logout();

    expect(apiClient.post).toHaveBeenCalledWith('/logout');
    expect(keysMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith('cache-a');
    expect(deleteMock).toHaveBeenCalledWith('cache-b');
  });

  it('ne leve jamais d\'erreur si la purge du cache echoue (best-effort)', async () => {
    (globalThis as { caches?: unknown }).caches = {
      keys: vi.fn().mockRejectedValue(new Error('Cache API indisponible')),
    };

    await expect(authApi.logout()).resolves.toBeUndefined();
    expect(apiClient.post).toHaveBeenCalledWith('/logout');
  });

  it('ne tente pas de purge si l\'API Cache Storage est absente du navigateur', async () => {
    delete (globalThis as { caches?: unknown }).caches;

    await expect(authApi.logout()).resolves.toBeUndefined();
    expect(apiClient.post).toHaveBeenCalledWith('/logout');
  });
});
