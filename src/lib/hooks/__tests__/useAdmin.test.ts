import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const storeState = {
  dashboardData: null,
  fetchDashboard: vi.fn().mockResolvedValue(undefined),
  fetchUsersStats: vi.fn().mockResolvedValue(undefined),
  fetchVoyagesStats: vi.fn().mockResolvedValue(undefined),
  fetchDemandesStats: vi.fn().mockResolvedValue(undefined),
  fetchSignalementsStats: vi.fn().mockResolvedValue(undefined),
  fetchActivityStats: vi.fn().mockResolvedValue(undefined),
  fetchEngagementStats: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/lib/store/adminStore', () => ({
  useAdminStore: () => storeState,
}));

import { useAdmin } from '../useAdmin';

describe('useAdmin.refetchAdminStats - recharge toutes les stats en parallele', () => {
  it('appelle les 7 fetchers de stats', async () => {
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.refetchAdminStats();
    });

    expect(storeState.fetchDashboard).toHaveBeenCalledTimes(1);
    expect(storeState.fetchUsersStats).toHaveBeenCalledTimes(1);
    expect(storeState.fetchVoyagesStats).toHaveBeenCalledTimes(1);
    expect(storeState.fetchDemandesStats).toHaveBeenCalledTimes(1);
    expect(storeState.fetchSignalementsStats).toHaveBeenCalledTimes(1);
    expect(storeState.fetchActivityStats).toHaveBeenCalledTimes(1);
    expect(storeState.fetchEngagementStats).toHaveBeenCalledTimes(1);
  });

  it('n\'echoue pas (ne relance pas) si l\'un des fetchers rejette', async () => {
    storeState.fetchVoyagesStats.mockRejectedValueOnce(new Error('Erreur reseau'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAdmin());

    await expect(
      act(async () => {
        await result.current.refetchAdminStats();
      })
    ).resolves.not.toThrow();

    vi.restoreAllMocks();
  });
});
