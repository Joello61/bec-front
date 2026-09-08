import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiError, Demande } from '@/types';

vi.mock('@/lib/api/demandes', () => ({
  demandesApi: {
    list: vi.fn(),
    create: vi.fn(),
  },
}));

import { demandesApi } from '@/lib/api/demandes';
import { useDemandeStore } from '../demandeStore';

const initialState = useDemandeStore.getState();

beforeEach(() => {
  useDemandeStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('demandeStore.fetchDemandes', () => {
  it('absorbe l\'erreur sans relancer', async () => {
    vi.mocked(demandesApi.list).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await expect(useDemandeStore.getState().fetchDemandes()).resolves.toBeUndefined();

    expect(useDemandeStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur' });
  });
});

describe('demandeStore.createDemande', () => {
  it('ajoute la demande creee en tete de mesDemandes et la retourne', async () => {
    const created = { id: 1 } as Demande;
    vi.mocked(demandesApi.create).mockResolvedValue(created);

    const result = await useDemandeStore.getState().createDemande({} as never);

    expect(result).toBe(created);
    expect(useDemandeStore.getState().mesDemandes).toEqual([created]);
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur de creation' };
    vi.mocked(demandesApi.create).mockRejectedValue(apiError);

    await expect(useDemandeStore.getState().createDemande({} as never)).rejects.toBe(apiError);
    expect(useDemandeStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur de creation' });
  });
});
