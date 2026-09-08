import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, Avis, AvisWithStats } from '@/types';

vi.mock('@/lib/api/avis', () => ({
  avisApi: {
    create: vi.fn(),
  },
}));

import { avisApi } from '@/lib/api/avis';

import { useAvisStore } from '../avisStore';

const initialState = useAvisStore.getState();

beforeEach(() => {
  useAvisStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('avisStore.createAvis', () => {
  it('ajoute l\'avis en tete et incremente le total quand avisWithStats existe deja', async () => {
    useAvisStore.setState({
      avisWithStats: { avis: [], stats: { total: 2 } } as unknown as AvisWithStats,
    });
    const created = { id: 1 } as Avis;
    vi.mocked(avisApi.create).mockResolvedValue(created);

    const result = await useAvisStore.getState().createAvis({} as never);

    expect(result).toBe(created);
    expect(useAvisStore.getState().avisWithStats).toMatchObject({ avis: [created], stats: { total: 3 } });
  });

  it('ne plante pas si avisWithStats est encore null', async () => {
    vi.mocked(avisApi.create).mockResolvedValue({ id: 1 } as Avis);

    await useAvisStore.getState().createAvis({} as never);

    expect(useAvisStore.getState()).toMatchObject({ avisWithStats: null, isLoading: false });
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur' };
    vi.mocked(avisApi.create).mockRejectedValue(apiError);

    await expect(useAvisStore.getState().createAvis({} as never)).rejects.toBe(apiError);
  });
});
