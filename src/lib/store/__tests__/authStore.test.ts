import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, User } from '@/types';

vi.mock('@/lib/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    verifyEmail: vi.fn(),
    verifyPhone: vi.fn(),
    resendVerification: vi.fn(),
    completeProfile: vi.fn(),
    getProfileStatus: vi.fn(),
    changePassword: vi.fn(),
  },
}));

vi.mock('@/lib/api/users', () => ({
  usersApi: {
    deleteAccount: vi.fn(),
  },
}));

import { authApi } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';

import { useAuthStore } from '../authStore';

const mockUser: User = {
  id: 1,
  email: 'jean@example.com',
  nom: 'Dupont',
  prenom: 'Jean',
  telephone: null,
  photo: null,
  bio: null,
  emailVerifie: true,
  telephoneVerifie: false,
  roles: ['ROLE_USER'],
  createdAt: '2026-01-01T00:00:00Z',
  isBanned: false,
  noteAvisMoyen: null,
  address: null,
};

const initialState = useAuthStore.getState();

beforeEach(() => {
  useAuthStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('authStore.login', () => {
  it('connecte l\'utilisateur en cas de succes', async () => {
    vi.mocked(authApi.login).mockResolvedValue({} as never);
    vi.mocked(authApi.me).mockResolvedValue(mockUser);

    await useAuthStore.getState().login({ email: mockUser.email, password: 'x' });

    expect(useAuthStore.getState()).toMatchObject({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });
  });

  it('normalise un email non verifie en erreur EMAIL_NOT_VERIFIED, quel que soit le message backend', async () => {
    const backendError: ApiError = { success: false, message: 'Merci de vérifier votre adresse email' };
    vi.mocked(authApi.login).mockRejectedValue(backendError);

    await expect(
      useAuthStore.getState().login({ email: mockUser.email, password: 'x' })
    ).rejects.toThrow('EMAIL_NOT_VERIFIED');

    expect(useAuthStore.getState()).toMatchObject({
      error: 'EMAIL_NOT_VERIFIED',
      isAuthenticated: false,
      user: null,
      pendingEmail: mockUser.email,
    });
  });

  it('relance l\'erreur brute sur un echec de connexion generique', async () => {
    const backendError: ApiError = { success: false, message: 'Identifiants invalides' };
    vi.mocked(authApi.login).mockRejectedValue(backendError);

    await expect(
      useAuthStore.getState().login({ email: mockUser.email, password: 'x' })
    ).rejects.toBe(backendError);

    expect(useAuthStore.getState()).toMatchObject({
      error: 'Identifiants invalides',
      isAuthenticated: false,
      user: null,
    });
  });
});

describe('authStore.logout', () => {
  it('reinitialise le state en cas de succes', async () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    vi.mocked(authApi.logout).mockResolvedValue(undefined);

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false, error: null });
  });

  it('deconnecte quand meme localement si l\'appel API echoue, sans relancer', async () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    vi.mocked(authApi.logout).mockRejectedValue({ success: false, message: 'Erreur reseau' } as ApiError);

    await expect(useAuthStore.getState().logout()).resolves.toBeUndefined();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      error: 'Erreur reseau',
    });
  });
});

describe('authStore.fetchMe', () => {
  it('retourne l\'utilisateur et met a jour le state en cas de succes', async () => {
    vi.mocked(authApi.me).mockResolvedValue(mockUser);

    const result = await useAuthStore.getState().fetchMe();

    expect(result).toEqual(mockUser);
    expect(useAuthStore.getState()).toMatchObject({ user: mockUser, isAuthenticated: true });
  });

  it('avale l\'erreur, retourne null sans exposer de message d\'erreur', async () => {
    vi.mocked(authApi.me).mockRejectedValue({ success: false, message: 'Non authentifie' } as ApiError);

    const result = await useAuthStore.getState().fetchMe();

    expect(result).toBeNull();
    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false, error: null });
  });
});

describe('authStore.deleteAccount', () => {
  it('garde l\'utilisateur connecte et relance l\'erreur en cas d\'echec (asymetrie volontaire avec logout)', async () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    const backendError: ApiError = { success: false, message: 'Mot de passe incorrect' };
    vi.mocked(usersApi.deleteAccount).mockRejectedValue(backendError);

    await expect(useAuthStore.getState().deleteAccount('mauvais-mdp')).rejects.toBe(backendError);

    expect(useAuthStore.getState()).toMatchObject({
      user: mockUser,
      isAuthenticated: true,
      error: 'Mot de passe incorrect',
    });
  });

  it('deconnecte l\'utilisateur en cas de succes', async () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    vi.mocked(usersApi.deleteAccount).mockResolvedValue(undefined);

    await useAuthStore.getState().deleteAccount('bon-mdp');

    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false });
  });
});

describe('authStore.checkProfileStatus', () => {
  it('ne touche pas isLoading/error, contrairement aux autres actions', async () => {
    vi.mocked(authApi.getProfileStatus).mockResolvedValue({
      isComplete: true,
      missing: [],
      emailVerifie: true,
      telephoneVerifie: true,
      hasAddress: true,
    });

    const result = await useAuthStore.getState().checkProfileStatus();

    expect(result).toBe(true);
    expect(useAuthStore.getState()).toMatchObject(initialState);
  });

  it('retourne false sans relancer en cas d\'echec', async () => {
    vi.mocked(authApi.getProfileStatus).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    const result = await useAuthStore.getState().checkProfileStatus();

    expect(result).toBe(false);
  });
});
