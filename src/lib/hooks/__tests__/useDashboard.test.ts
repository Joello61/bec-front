import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const dashboardMock = vi.fn();
vi.mock('@/lib/api/users', () => ({
  usersApi: { dashboard: (...args: unknown[]) => dashboardMock(...args) },
}));

import { useDashboard } from '../useDashboard';

describe('useDashboard - contourne le store, appelle usersApi directement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('charge les donnees du dashboard au montage', async () => {
    dashboardMock.mockResolvedValueOnce({ totalVoyages: 3 });

    const { result } = renderHook(() => useDashboard());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual({ totalVoyages: 3 });
    expect(result.current.error).toBeNull();
  });

  it('capture l\'erreur localement sans propager', async () => {
    dashboardMock.mockRejectedValueOnce(new Error('Erreur reseau'));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Erreur reseau');
    expect(result.current.data).toBeNull();
  });

  it('refresh() relance le chargement', async () => {
    dashboardMock.mockResolvedValue({ totalVoyages: 1 });

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    dashboardMock.mockClear();
    await act(async () => {
      await result.current.refresh();
    });

    expect(dashboardMock).toHaveBeenCalledTimes(1);
  });
});
