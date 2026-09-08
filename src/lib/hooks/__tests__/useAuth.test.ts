import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/types';

const storeState: Record<string, unknown> = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: true,
  error: null,
  pendingEmail: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  fetchMe: vi.fn(),
  verifyEmail: vi.fn(),
  verifyPhone: vi.fn(),
  resendVerification: vi.fn(),
  completeProfile: vi.fn(),
  checkProfileStatus: vi.fn(),
  changePassword: vi.fn(),
  deleteAccount: vi.fn(),
  clearError: vi.fn(),
  setPendingEmail: vi.fn(),
};

vi.mock('@/lib/store', () => ({
  useAuthStore: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}));

import { useAuth, useAuthError, useProfileCompletion, useRequireAuth } from '../useAuth';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean@example.com',
    emailVerifie: true,
    telephoneVerifie: true,
    address: { id: 1 } as User['address'],
    settings: { devise: 'EUR' } as User['settings'],
    ...overrides,
  } as User;
}

describe('useAuth.getUserCurrency', () => {
  it('renvoie la devise des parametres utilisateur si presente', () => {
    storeState.user = makeUser({ settings: { devise: 'XAF' } as User['settings'] });
    const { result } = renderHook(() => useAuth());

    expect(result.current.getUserCurrency()).toBe('XAF');
  });

  it('replie sur EUR si aucun utilisateur ou aucune devise definie', () => {
    storeState.user = null;
    const { result } = renderHook(() => useAuth());

    expect(result.current.getUserCurrency()).toBe('EUR');
  });
});

describe('useProfileCompletion - derivation pure a partir de user/isAuthenticated', () => {
  beforeEach(() => {
    storeState.isAuthenticated = true;
  });

  it('considere le profil complet si email verifie + telephone verifie + adresse presente', () => {
    storeState.user = makeUser();
    const { result } = renderHook(() => useProfileCompletion());

    expect(result.current.isProfileComplete).toBe(true);
    expect(result.current.needsEmailVerification).toBe(false);
    expect(result.current.needsPhoneVerification).toBe(false);
    expect(result.current.needsAddressCompletion).toBe(false);
  });

  it('signale needsEmailVerification si emailVerifie est faux', () => {
    storeState.user = makeUser({ emailVerifie: false });
    const { result } = renderHook(() => useProfileCompletion());

    expect(result.current.isProfileComplete).toBe(false);
    expect(result.current.needsEmailVerification).toBe(true);
  });

  it('signale needsAddressCompletion si address est absente', () => {
    storeState.user = makeUser({ address: null as unknown as User['address'] });
    const { result } = renderHook(() => useProfileCompletion());

    expect(result.current.isProfileComplete).toBe(false);
    expect(result.current.needsAddressCompletion).toBe(true);
  });

  it('ne signale aucun besoin de verification si l\'utilisateur n\'est pas authentifie', () => {
    storeState.isAuthenticated = false;
    storeState.user = null;
    const { result } = renderHook(() => useProfileCompletion());

    expect(result.current.needsEmailVerification).toBe(false);
    expect(result.current.needsPhoneVerification).toBe(false);
    expect(result.current.needsAddressCompletion).toBe(false);
  });
});

describe('useAuthError - distingue EMAIL_NOT_VERIFIED des autres erreurs', () => {
  it('isEmailNotVerified est vrai et hasError est faux pour le sentinel EMAIL_NOT_VERIFIED', () => {
    storeState.error = 'EMAIL_NOT_VERIFIED';
    const { result } = renderHook(() => useAuthError());

    expect(result.current.isEmailNotVerified).toBe(true);
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('hasError est vrai pour toute autre erreur non nulle', () => {
    storeState.error = 'Identifiants invalides';
    const { result } = renderHook(() => useAuthError());

    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Identifiants invalides');
  });

  it('aucune erreur si error est null', () => {
    storeState.error = null;
    const { result } = renderHook(() => useAuthError());

    expect(result.current.hasError).toBe(false);
    expect(result.current.isEmailNotVerified).toBe(false);
  });
});

describe('useRequireAuth - canAccess exige authentification ET initialisation', () => {
  it('canAccess est vrai seulement si authentifie et initialise', () => {
    storeState.isAuthenticated = true;
    storeState.isInitialized = true;
    expect(renderHook(() => useRequireAuth()).result.current.canAccess).toBe(true);

    storeState.isAuthenticated = true;
    storeState.isInitialized = false;
    expect(renderHook(() => useRequireAuth()).result.current.canAccess).toBe(false);

    storeState.isAuthenticated = false;
    storeState.isInitialized = true;
    expect(renderHook(() => useRequireAuth()).result.current.canAccess).toBe(false);
  });
});
