import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiError, Voyage } from '@/types';

vi.mock('@/lib/api/voyages', () => ({
  voyagesApi: {
    list: vi.fn(),
    create: vi.fn(),
  },
}));

import { voyagesApi } from '@/lib/api/voyages';
import { useVoyageStore } from '../voyageStore';

const initialState = useVoyageStore.getState();

beforeEach(() => {
  useVoyageStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('voyageStore.fetchVoyages', () => {
  it('absorbe l\'erreur sans relancer', async () => {
    vi.mocked(voyagesApi.list).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await expect(useVoyageStore.getState().fetchVoyages()).resolves.toBeUndefined();

    expect(useVoyageStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur' });
  });
});

describe('voyageStore.createVoyage', () => {
  it('ajoute le voyage cree en tete de mesVoyages et le retourne', async () => {
    const created = { id: 1 } as Voyage;
    vi.mocked(voyagesApi.create).mockResolvedValue(created);

    const result = await useVoyageStore.getState().createVoyage({} as never);

    expect(result).toBe(created);
    expect(useVoyageStore.getState().mesVoyages).toEqual([created]);
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur de creation' };
    vi.mocked(voyagesApi.create).mockRejectedValue(apiError);

    await expect(useVoyageStore.getState().createVoyage({} as never)).rejects.toBe(apiError);
    expect(useVoyageStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur de creation' });
  });
});
