import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const storeState = {
  favoris: [],
  favorisVoyages: [],
  favorisDemandes: [],
  isLoading: false,
  error: null,
  fetchFavoris: vi.fn(),
  fetchFavorisVoyages: vi.fn(),
  fetchFavorisDemandes: vi.fn(),
};

vi.mock('@/lib/store', () => ({
  useFavoriStore: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}));

let mockPathname = '/dashboard/explore';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

import { useFavoris, useFavorisVoyages, useFavorisDemandes } from '../useFavoris';

describe('useFavoris - fetch inconditionnel au montage', () => {
  it('declenche fetchFavoris au montage quelle que soit la page', () => {
    mockPathname = '/dashboard/explore';
    renderHook(() => useFavoris());
    expect(storeState.fetchFavoris).toHaveBeenCalledTimes(1);
  });
});

describe('useFavorisVoyages / useFavorisDemandes - fetch conditionne a la page /dashboard/favoris', () => {
  beforeEach(() => vi.clearAllMocks());

  it('ne fait aucun appel en dehors de la page favoris', () => {
    mockPathname = '/dashboard/explore';
    renderHook(() => useFavorisVoyages());
    renderHook(() => useFavorisDemandes());

    expect(storeState.fetchFavorisVoyages).not.toHaveBeenCalled();
    expect(storeState.fetchFavorisDemandes).not.toHaveBeenCalled();
  });

  it('declenche le fetch sur la page /dashboard/favoris', () => {
    mockPathname = '/dashboard/favoris';
    renderHook(() => useFavorisVoyages());
    renderHook(() => useFavorisDemandes());

    expect(storeState.fetchFavorisVoyages).toHaveBeenCalledTimes(1);
    expect(storeState.fetchFavorisDemandes).toHaveBeenCalledTimes(1);
  });
});
