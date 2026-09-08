import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const storeState = {
  demandes: [],
  publicDemandes: [],
  pagination: null,
  isLoading: false,
  error: null,
  currentDemande: null,
  mesDemandes: [],
  fetchDemandes: vi.fn(),
  fetchPublicDemandes: vi.fn(),
  fetchDemande: vi.fn(),
  fetchUserDemandes: vi.fn(),
  createDemande: vi.fn(),
  updateDemande: vi.fn(),
  updateStatus: vi.fn(),
  deleteDemande: vi.fn(),
  clearError: vi.fn(),
};

vi.mock('@/lib/store', () => ({
  useDemandeStore: (selector: (state: typeof storeState) => unknown) => selector(storeState),
}));

const getMatchingVoyagesMock = vi.fn();
vi.mock('@/lib/api/demandes', () => ({
  demandesApi: { getMatchingVoyages: (...args: unknown[]) => getMatchingVoyagesMock(...args) },
}));

import { useDemandes, useMatchingVoyages } from '../useDemandes';

describe('useDemandes - branchement effet -> action de store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('declenche fetchDemandes au montage avec page/limit/filters', () => {
    renderHook(() => useDemandes(1, 10, { villeArrivee: 'Paris' }));

    expect(storeState.fetchDemandes).toHaveBeenCalledWith(1, 10, { villeArrivee: 'Paris' });
  });

  it('ne redeclenche pas le fetch si "filters" change de reference mais pas de contenu', () => {
    const { rerender } = renderHook(
      ({ filters }: { filters: { villeArrivee: string } }) => useDemandes(1, 10, filters),
      { initialProps: { filters: { villeArrivee: 'Paris' } } }
    );
    expect(storeState.fetchDemandes).toHaveBeenCalledTimes(1);

    rerender({ filters: { villeArrivee: 'Paris' } });
    expect(storeState.fetchDemandes).toHaveBeenCalledTimes(1);
  });
});

describe('useMatchingVoyages - contourne le store, appelle demandesApi directement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ne fait aucun appel si demandeId est absent', () => {
    renderHook(() => useMatchingVoyages(undefined));

    expect(getMatchingVoyagesMock).not.toHaveBeenCalled();
  });

  it('charge les voyages correspondants et pilote isLoading/error localement', async () => {
    getMatchingVoyagesMock.mockResolvedValueOnce([{ id: 5 }]);

    const { result } = renderHook(() => useMatchingVoyages(3));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getMatchingVoyagesMock).toHaveBeenCalledWith(3);
    expect(result.current.voyages).toEqual([{ id: 5 }]);
  });

  it('capture l\'erreur localement sans propager', async () => {
    getMatchingVoyagesMock.mockRejectedValueOnce(new Error('Erreur reseau'));

    const { result } = renderHook(() => useMatchingVoyages(3));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Erreur reseau');
    expect(result.current.voyages).toEqual([]);
  });
});
