import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, Signalement } from '@/types';

vi.mock('@/lib/api/signalement', () => ({
  signalementsApi: {
    create: vi.fn(),
    getPendingCount: vi.fn(),
  },
}));

import { signalementsApi } from '@/lib/api/signalement';

import { useSignalementStore } from '../signalementStore';

const initialState = useSignalementStore.getState();

beforeEach(() => {
  useSignalementStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('signalementStore.createSignalement', () => {
  it('ajoute le signalement en tete et incremente pendingCount', async () => {
    const created = { id: 1 } as Signalement;
    vi.mocked(signalementsApi.create).mockResolvedValue(created);

    const result = await useSignalementStore.getState().createSignalement({} as never);

    expect(result).toBe(created);
    expect(useSignalementStore.getState()).toMatchObject({ signalements: [created], pendingCount: 1 });
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur' };
    vi.mocked(signalementsApi.create).mockRejectedValue(apiError);

    await expect(useSignalementStore.getState().createSignalement({} as never)).rejects.toBe(apiError);
  });
});

describe('signalementStore.fetchPendingCount', () => {
  it('ne touche pas isLoading/error en cas d\'echec (compteur silencieux)', async () => {
    vi.mocked(signalementsApi.getPendingCount).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await useSignalementStore.getState().fetchPendingCount();

    expect(useSignalementStore.getState()).toMatchObject({ isLoading: false, error: null });
  });
});
