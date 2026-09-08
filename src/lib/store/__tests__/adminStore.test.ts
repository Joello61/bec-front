import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, User } from '@/types';

vi.mock('@/lib/api/admin', () => ({
  adminApi: {
    getDashboard: vi.fn(),
    banUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

import { adminApi } from '@/lib/api/admin';

import { useAdminStore } from '../adminStore';

const initialState = useAdminStore.getState();

const mockUser = { id: 1 } as User;

beforeEach(() => {
  useAdminStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('adminStore (representatif des 25 actions, toutes generees par le meme pattern)', () => {
  it('fetchDashboard : charge les donnees en cas de succes', async () => {
    vi.mocked(adminApi.getDashboard).mockResolvedValue({} as never);

    await useAdminStore.getState().fetchDashboard();

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: null });
  });

  it('fetchDashboard : absorbe l\'erreur sans relancer (forme fetch)', async () => {
    vi.mocked(adminApi.getDashboard).mockRejectedValue({ success: false, message: 'Erreur serveur' } as ApiError);

    await expect(useAdminStore.getState().fetchDashboard()).resolves.toBeUndefined();

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur serveur' });
  });

  it('banUser : relance l\'erreur en cas d\'echec (forme mutation)', async () => {
    const apiError: ApiError = { success: false, message: 'Utilisateur introuvable' };
    vi.mocked(adminApi.banUser).mockRejectedValue(apiError);

    await expect(
      useAdminStore.getState().banUser(1, { reason: 'spam', type: 'permanent' })
    ).rejects.toBe(apiError);

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: 'Utilisateur introuvable' });
  });

  it('deleteUser : retire l\'utilisateur de la liste en cas de succes (etat de succes personnalise)', async () => {
    useAdminStore.setState({ users: [mockUser, { id: 2 } as User] });
    vi.mocked(adminApi.deleteUser).mockResolvedValue(undefined);

    await useAdminStore.getState().deleteUser(1, 'RGPD');

    expect(useAdminStore.getState().users).toEqual([{ id: 2 }]);
  });
});
