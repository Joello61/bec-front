import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError } from '@/types';
import type { Country } from '@/types/geo';

vi.mock('@/lib/api/geo', () => ({
  geoApi: {
    getCountries: vi.fn(),
    getCities: vi.fn(),
  },
}));

import { geoApi } from '@/lib/api/geo';

import { useGeoStore } from '../geoStore';

const initialState = useGeoStore.getState();

beforeEach(() => {
  useGeoStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('geoStore.fetchCountries', () => {
  it('pilote isLoadingCountries, jamais isLoading (qui n\'existe pas dans cet etat)', async () => {
    vi.mocked(geoApi.getCountries).mockResolvedValue([{ value: 'CM', label: 'Cameroun' } as Country]);

    const promise = useGeoStore.getState().fetchCountries();
    expect(useGeoStore.getState().isLoadingCountries).toBe(true);
    await promise;

    expect(useGeoStore.getState()).toMatchObject({ isLoadingCountries: false, countries: [{ value: 'CM', label: 'Cameroun' }] });
  });

  it('ne rappelle pas l\'API si les pays sont deja en cache', async () => {
    useGeoStore.setState({ countries: [{ value: 'CM', label: 'Cameroun' } as Country] });

    await useGeoStore.getState().fetchCountries();

    expect(geoApi.getCountries).not.toHaveBeenCalled();
  });

  it('absorbe l\'erreur sur isLoadingCountries uniquement', async () => {
    vi.mocked(geoApi.getCountries).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    await useGeoStore.getState().fetchCountries();

    expect(useGeoStore.getState()).toMatchObject({
      isLoadingCountries: false,
      isLoadingCities: false,
      error: 'Erreur',
    });
  });
});

describe('geoStore.fetchCities', () => {
  it('ne rappelle pas l\'API si les villes du pays sont deja en cache', async () => {
    useGeoStore.setState({ cities: { Cameroun: [] } });

    await useGeoStore.getState().fetchCities('Cameroun');

    expect(geoApi.getCities).not.toHaveBeenCalled();
  });
});
