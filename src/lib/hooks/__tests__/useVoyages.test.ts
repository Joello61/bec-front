import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const storeState = {
  voyages: [],
  publicVoyages: [],
  pagination: null,
  isLoading: false,
  error: null,
  currentVoyage: null,
  mesVoyages: [],
  fetchVoyages: vi.fn(),
  fetchPublicVoyages: vi.fn(),
  fetchVoyage: vi.fn(),
  fetchUserVoyages: vi.fn(),
  createVoyage: vi.fn(),
  updateVoyage: vi.fn(),
  updateStatus: vi.fn(),
  deleteVoyage: vi.fn(),
  clearError: vi.fn(),
};

vi.mock('@/lib/store', () => ({
  useVoyageStore: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}));

const getMatchingDemandesMock = vi.fn();
vi.mock('@/lib/api/voyages', () => ({
  voyagesApi: { getMatchingDemandes: (...args: unknown[]) => getMatchingDemandesMock(...args) },
}));

import { useVoyages, useMatchingDemandes } from '../useVoyages';

describe('useVoyages - branchement effet -> action de store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('declenche fetchVoyages au montage avec page/limit/filters', () => {
    renderHook(() => useVoyages(2, 10, { villeDepart: 'Douala' }));

    expect(storeState.fetchVoyages).toHaveBeenCalledWith(2, 10, { villeDepart: 'Douala' });
  });

  it('ne redeclenche pas le fetch si "filters" change de reference mais pas de contenu (stabilisation JSON.stringify)', () => {
    const { rerender } = renderHook(
      ({ filters }: { filters: { villeDepart: string } }) => useVoyages(1, 10, filters),
      { initialProps: { filters: { villeDepart: 'Douala' } } }
    );
    expect(storeState.fetchVoyages).toHaveBeenCalledTimes(1);

    rerender({ filters: { villeDepart: 'Douala' } }); // nouvelle reference, meme contenu
    expect(storeState.fetchVoyages).toHaveBeenCalledTimes(1);
  });

  it('redeclenche le fetch si le contenu de "filters" change reellement', () => {
    const { rerender } = renderHook(
      ({ filters }: { filters: { villeDepart: string } }) => useVoyages(1, 10, filters),
      { initialProps: { filters: { villeDepart: 'Douala' } } }
    );
    expect(storeState.fetchVoyages).toHaveBeenCalledTimes(1);

    rerender({ filters: { villeDepart: 'Yaounde' } });
    expect(storeState.fetchVoyages).toHaveBeenCalledTimes(2);
  });
});

describe('useMatchingDemandes - contourne le store, appelle voyagesApi directement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ne fait aucun appel si voyageId est absent', () => {
    renderHook(() => useMatchingDemandes(undefined));

    expect(getMatchingDemandesMock).not.toHaveBeenCalled();
  });

  it('charge les demandes correspondantes et pilote isLoading/error localement', async () => {
    getMatchingDemandesMock.mockResolvedValueOnce([{ id: 1 }]);

    const { result } = renderHook(() => useMatchingDemandes(7));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getMatchingDemandesMock).toHaveBeenCalledWith(7);
    expect(result.current.demandes).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });

  it('capture l\'erreur localement sans propager (duplication du pattern try/catch elimine des stores en Phase 7)', async () => {
    getMatchingDemandesMock.mockRejectedValueOnce(new Error('Erreur reseau'));

    const { result } = renderHook(() => useMatchingDemandes(7));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Erreur reseau');
    expect(result.current.demandes).toEqual([]);
  });
});
