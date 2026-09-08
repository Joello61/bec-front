import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError } from '@/types';
import type { Address, AddressModificationInfo } from '@/types/address';

vi.mock('@/lib/api/address', () => ({
  addressApi: {
    updateAddress: vi.fn(),
    getModificationInfo: vi.fn(),
  },
}));

import { addressApi } from '@/lib/api/address';

import { useAddressStore } from '../addressStore';

const initialState = useAddressStore.getState();

beforeEach(() => {
  useAddressStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('addressStore.updateAddress', () => {
  it('met a jour l\'adresse puis recharge les infos de modification', async () => {
    const updated = { ville: 'Douala' } as Address;
    const info = { canModify: false } as AddressModificationInfo;
    vi.mocked(addressApi.updateAddress).mockResolvedValue({
      success: true,
      message: 'ok',
      address: updated,
      nextModificationDate: null,
    });
    vi.mocked(addressApi.getModificationInfo).mockResolvedValue(info);

    await useAddressStore.getState().updateAddress({} as never);

    expect(useAddressStore.getState()).toMatchObject({ address: updated, modificationInfo: info, isLoading: false });
  });

  it('relance l\'erreur sans recharger les infos de modification', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur' };
    vi.mocked(addressApi.updateAddress).mockRejectedValue(apiError);

    await expect(useAddressStore.getState().updateAddress({} as never)).rejects.toBe(apiError);
    expect(addressApi.getModificationInfo).not.toHaveBeenCalled();
  });
});
