import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const authState: Record<string, unknown> = {
  isAuthenticated: false,
};

const settingsState: Record<string, unknown> = {
  settings: null,
  isLoading: false,
  error: null,
  fetchSettings: vi.fn(),
};

const currencyState: Record<string, unknown> = {
  defaultCurrency: 'XAF',
};

vi.mock('@/lib/store/authStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

vi.mock('../../store', () => ({
  useSettingsStore: (selector: (state: typeof settingsState) => unknown) => selector(settingsState),
}));

vi.mock('@/lib/store/currencyStore', () => ({
  useCurrencyStore: (selector: (state: typeof currencyState) => unknown) => selector(currencyState),
}));

import { useUserCurrency } from '../useCurrency';

/**
 * Regression : sur la page pricing publique (Lot N2), GET /api/settings partait en
 * boucle infinie de 403 pour un visiteur non connecte. Deux causes cumulees :
 * useUserCurrency() n'a jamais verifie l'authentification avant d'appeler
 * fetchSettings(), et l'effet ne prenait pas en compte le champ `error` du store -
 * un echec remettait isLoading a false sans jamais poser `settings`, ce qui
 * re-declenchait aussitot un nouvel appel a chaque rendu.
 */
describe('useUserCurrency', () => {
  beforeEach(() => {
    authState.isAuthenticated = false;
    settingsState.settings = null;
    settingsState.isLoading = false;
    settingsState.error = null;
    currencyState.defaultCurrency = 'XAF';
    (settingsState.fetchSettings as ReturnType<typeof vi.fn>).mockClear();
  });

  it("n'appelle jamais fetchSettings pour un visiteur non authentifie", () => {
    authState.isAuthenticated = false;

    const { result } = renderHook(() => useUserCurrency());

    expect(settingsState.fetchSettings).not.toHaveBeenCalled();
    expect(result.current.userCurrency).toBe('XAF');
  });

  it('appelle fetchSettings une fois pour un utilisateur authentifie sans settings charges', () => {
    authState.isAuthenticated = true;

    renderHook(() => useUserCurrency());

    expect(settingsState.fetchSettings).toHaveBeenCalledTimes(1);
  });

  it("ne reessaie jamais fetchSettings si une erreur est deja presente (pas de boucle infinie)", () => {
    authState.isAuthenticated = true;
    settingsState.error = 'Erreur lors du chargement des paramètres';

    renderHook(() => useUserCurrency());

    expect(settingsState.fetchSettings).not.toHaveBeenCalled();
  });

  it('utilise la devise des settings charges quand disponible', () => {
    authState.isAuthenticated = true;
    settingsState.settings = { devise: 'EUR' };

    const { result } = renderHook(() => useUserCurrency());

    expect(result.current.userCurrency).toBe('EUR');
    expect(settingsState.fetchSettings).not.toHaveBeenCalled();
  });
});
