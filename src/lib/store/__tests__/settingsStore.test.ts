import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, UserSettings } from '@/types';

vi.mock('@/lib/api/settings', () => ({
  settingsApi: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

import { settingsApi } from '@/lib/api/settings';

import { useSettingsStore } from '../settingsStore';

const initialState = useSettingsStore.getState();
const mockSettings = { id: 1 } as UserSettings;

beforeEach(() => {
  useSettingsStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('settingsStore.fetchSettings', () => {
  it('charge les parametres en cas de succes', async () => {
    vi.mocked(settingsApi.get).mockResolvedValue(mockSettings);

    await useSettingsStore.getState().fetchSettings();

    expect(useSettingsStore.getState()).toMatchObject({ settings: mockSettings, isLoading: false });
  });

  it('ne refait pas d\'appel si des parametres sont deja charges (garde-fou preexistant)', async () => {
    useSettingsStore.setState({ settings: mockSettings });

    await useSettingsStore.getState().fetchSettings();

    expect(settingsApi.get).not.toHaveBeenCalled();
  });
});

describe('settingsStore.updateSettings', () => {
  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur de validation' };
    vi.mocked(settingsApi.update).mockRejectedValue(apiError);

    await expect(
      useSettingsStore.getState().updateSettings({} as never)
    ).rejects.toBe(apiError);

    expect(useSettingsStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur de validation' });
  });
});
