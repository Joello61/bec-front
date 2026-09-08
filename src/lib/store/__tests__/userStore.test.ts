import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, User } from '@/types';

vi.mock('@/lib/api/users', () => ({
  usersApi: {
    list: vi.fn(),
    show: vi.fn(),
    updateMe: vi.fn(),
    search: vi.fn(),
    uploadAvatar: vi.fn(),
    deleteAvatar: vi.fn(),
  },
}));

import { usersApi } from '@/lib/api/users';

import { useUserStore } from '../userStore';

const initialState = useUserStore.getState();

const mockUser = { id: 1, photo: null } as User;

beforeEach(() => {
  useUserStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('userStore.uploadAvatar', () => {
  it('pilote isUploadingAvatar (pas isLoading) et met a jour la photo du currentUser', async () => {
    useUserStore.setState({ currentUser: mockUser });
    vi.mocked(usersApi.uploadAvatar).mockResolvedValue({ success: true, message: 'ok', photoUrl: '/photo.jpg' });

    const result = await useUserStore.getState().uploadAvatar(new File([], 'photo.jpg'));

    expect(result).toBe('/photo.jpg');
    expect(useUserStore.getState()).toMatchObject({
      isUploadingAvatar: false,
      isLoading: false,
      currentUser: { ...mockUser, photo: '/photo.jpg' },
    });
  });

  it('relance une Error normalisee (pas l\'ApiError brute) en cas d\'echec', async () => {
    vi.mocked(usersApi.uploadAvatar).mockRejectedValue({ success: false, message: 'Fichier trop volumineux' } as ApiError);

    await expect(
      useUserStore.getState().uploadAvatar(new File([], 'photo.jpg'))
    ).rejects.toThrow('Fichier trop volumineux');

    expect(useUserStore.getState()).toMatchObject({ isUploadingAvatar: false, error: 'Fichier trop volumineux' });
  });
});

describe('userStore.deleteAvatar', () => {
  it('retire la photo du currentUser en cas de succes', async () => {
    useUserStore.setState({ currentUser: { ...mockUser, photo: '/photo.jpg' } });
    vi.mocked(usersApi.deleteAvatar).mockResolvedValue({ success: true, message: 'ok', photoUrl: null });

    await useUserStore.getState().deleteAvatar();

    expect(useUserStore.getState().currentUser).toMatchObject({ photo: null });
  });
});

describe('userStore.fetchUsers', () => {
  it('absorbe l\'erreur sans relancer', async () => {
    vi.mocked(usersApi.list).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await expect(useUserStore.getState().fetchUsers()).resolves.toBeUndefined();

    expect(useUserStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur' });
  });
});
