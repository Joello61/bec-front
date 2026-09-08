import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, Proposition } from '@/types';

vi.mock('@/lib/api/propositions', () => ({
  propositionsApi: {
    getById: vi.fn(),
    getMyPendingCount: vi.fn(),
  },
}));

import { propositionsApi } from '@/lib/api/propositions';

import { usePropositionStore } from '../propositionStore';

const initialState = usePropositionStore.getState();

beforeEach(() => {
  usePropositionStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('propositionStore.getById', () => {
  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Introuvable' };
    vi.mocked(propositionsApi.getById).mockRejectedValue(apiError);

    await expect(usePropositionStore.getState().getById(1)).rejects.toBe(apiError);
    expect(usePropositionStore.getState()).toMatchObject({ isLoading: false, error: 'Introuvable' });
  });

  it('retourne la proposition en cas de succes', async () => {
    const proposition = { id: 1 } as Proposition;
    vi.mocked(propositionsApi.getById).mockResolvedValue(proposition);

    const result = await usePropositionStore.getState().getById(1);

    expect(result).toBe(proposition);
    expect(usePropositionStore.getState().currentProposition).toBe(proposition);
  });
});

describe('propositionStore.fetchPendingCount', () => {
  it('ne touche pas isLoading/error, meme en cas d\'echec (compteur silencieux)', async () => {
    vi.mocked(propositionsApi.getMyPendingCount).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await usePropositionStore.getState().fetchPendingCount();

    expect(usePropositionStore.getState()).toMatchObject({ isLoading: false, error: null, pendingCount: 0 });
  });
});
