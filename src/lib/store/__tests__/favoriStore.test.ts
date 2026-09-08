import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, Favori } from '@/types';

vi.mock('@/lib/api/favoris', () => ({
  favorisApi: {
    addVoyage: vi.fn(),
    getVoyages: vi.fn(),
  },
}));

import { favorisApi } from '@/lib/api/favoris';

import { useFavoriStore } from '../favoriStore';

const initialState = useFavoriStore.getState();

beforeEach(() => {
  useFavoriStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('favoriStore.addVoyageToFavoris', () => {
  it('recharge la liste complete des favoris voyages apres ajout (pas de merge local)', async () => {
    const reloaded = [{ id: 1 } as Favori, { id: 2 } as Favori];
    vi.mocked(favorisApi.addVoyage).mockResolvedValue({ id: 1 } as Favori);
    vi.mocked(favorisApi.getVoyages).mockResolvedValue(reloaded);

    await useFavoriStore.getState().addVoyageToFavoris(42);

    expect(favorisApi.addVoyage).toHaveBeenCalledWith(42);
    expect(useFavoriStore.getState().favorisVoyages).toEqual(reloaded);
  });

  it('relance l\'erreur en cas d\'echec, sans recharger', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur' };
    vi.mocked(favorisApi.addVoyage).mockRejectedValue(apiError);

    await expect(useFavoriStore.getState().addVoyageToFavoris(42)).rejects.toBe(apiError);
    expect(favorisApi.getVoyages).not.toHaveBeenCalled();
  });
});

describe('favoriStore.isFavoriVoyage', () => {
  it('detecte un voyage deja en favori', () => {
    useFavoriStore.setState({ favorisVoyages: [{ voyage: { id: 42 } } as Favori] });

    expect(useFavoriStore.getState().isFavoriVoyage(42)).toBe(true);
    expect(useFavoriStore.getState().isFavoriVoyage(99)).toBe(false);
  });
});
