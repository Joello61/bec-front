import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const geoState = {
  countries: [] as { nom: string }[],
  cities: {} as Record<string, { nom: string }[]>,
  topCitiesGlobal: [] as { nom: string }[],
  continentByCountry: {} as Record<string, string>,
  fetchCountries: vi.fn(),
  fetchCities: vi.fn().mockResolvedValue(undefined),
  searchCities: vi.fn(),
  fetchTopCitiesGlobal: vi.fn(),
  searchCitiesGlobal: vi.fn(),
  fetchContinentByPays: vi.fn(),
};

function useGeoStoreMock<T>(selector?: (state: typeof geoState) => T) {
  return selector ? selector(geoState) : (geoState as unknown as T);
}
useGeoStoreMock.getState = () => geoState;

const authState = { user: null as { address?: { pays?: string } } | null };
function useAuthStoreMock<T>(selector: (state: typeof authState) => T) {
  return selector(authState);
}

vi.mock('@/lib/store', () => ({
  useGeoStore: useGeoStoreMock,
  useAuthStore: useAuthStoreMock,
}));

import { useCities, useCitySearch, useCitySearchGlobal, useCountries, useTopCitiesGlobal, useUserContinent } from '../useGeo';

describe('useCountries - fetch unique, pas de refetch si deja en cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    geoState.countries = [];
  });

  it('declenche fetchCountries au montage si le store est vide', () => {
    renderHook(() => useCountries());
    expect(geoState.fetchCountries).toHaveBeenCalledTimes(1);
  });

  it('ne declenche pas fetchCountries si le store contient deja des pays', () => {
    geoState.countries = [{ nom: 'Cameroun' }];
    renderHook(() => useCountries());
    expect(geoState.fetchCountries).not.toHaveBeenCalled();
  });
});

describe('useCities - fetch par pays, avec cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    geoState.cities = {};
  });

  it('ne fait aucun appel si countryName est null', () => {
    renderHook(() => useCities(null));
    expect(geoState.fetchCities).not.toHaveBeenCalled();
  });

  it('declenche fetchCities pour un pays non encore en cache', () => {
    renderHook(() => useCities('Cameroun'));
    expect(geoState.fetchCities).toHaveBeenCalledWith('Cameroun');
  });

  it('ne declenche pas fetchCities si le pays est deja en cache', () => {
    geoState.cities = { Cameroun: [{ nom: 'Douala' }] };
    renderHook(() => useCities('Cameroun'));
    expect(geoState.fetchCities).not.toHaveBeenCalled();
  });

  it('redeclenche fetchCities si le pays selectionne change', () => {
    const { rerender } = renderHook(({ country }: { country: string | null }) => useCities(country), {
      initialProps: { country: 'Cameroun' },
    });
    expect(geoState.fetchCities).toHaveBeenCalledWith('Cameroun');

    rerender({ country: 'France' });
    expect(geoState.fetchCities).toHaveBeenCalledWith('France');
  });
});

describe('useCitySearch - garde-fous de recherche', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ne recherche pas si aucun pays n\'est selectionne', async () => {
    const { result } = renderHook(() => useCitySearch(null));
    await act(async () => {
      await result.current.search('pa');
    });
    expect(geoState.searchCities).not.toHaveBeenCalled();
    expect(result.current.searchResults).toEqual([]);
  });

  it('ne recherche pas pour une requete de moins de 2 caracteres', async () => {
    const { result } = renderHook(() => useCitySearch('Cameroun'));
    await act(async () => {
      await result.current.search('d');
    });
    expect(geoState.searchCities).not.toHaveBeenCalled();
  });

  it('recherche a partir de 2 caracteres avec un pays selectionne', async () => {
    geoState.searchCities.mockResolvedValueOnce([{ nom: 'Douala' }]);
    const { result } = renderHook(() => useCitySearch('Cameroun'));

    await act(async () => {
      await result.current.search('do');
    });

    expect(geoState.searchCities).toHaveBeenCalledWith('Cameroun', 'do');
    expect(result.current.searchResults).toEqual([{ nom: 'Douala' }]);
  });
});

describe('useTopCitiesGlobal - meme pattern de fetch unique que useCountries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    geoState.topCitiesGlobal = [];
  });

  it('declenche fetchTopCitiesGlobal au montage si vide', () => {
    renderHook(() => useTopCitiesGlobal());
    expect(geoState.fetchTopCitiesGlobal).toHaveBeenCalledTimes(1);
  });

  it('ne refetch pas si deja peuple', () => {
    geoState.topCitiesGlobal = [{ nom: 'Paris' }];
    renderHook(() => useTopCitiesGlobal());
    expect(geoState.fetchTopCitiesGlobal).not.toHaveBeenCalled();
  });
});

describe('useCitySearchGlobal - garde-fou min 2 caracteres', () => {
  beforeEach(() => vi.clearAllMocks());

  it('ne recherche pas pour une requete de moins de 2 caracteres', async () => {
    const { result } = renderHook(() => useCitySearchGlobal());
    await act(async () => {
      await result.current.search('p');
    });
    expect(geoState.searchCitiesGlobal).not.toHaveBeenCalled();
  });

  it('recherche a partir de 2 caracteres', async () => {
    geoState.searchCitiesGlobal.mockResolvedValueOnce([{ nom: 'Paris' }]);
    const { result } = renderHook(() => useCitySearchGlobal());

    await act(async () => {
      await result.current.search('pa', 20);
    });

    expect(geoState.searchCitiesGlobal).toHaveBeenCalledWith('pa', 20);
  });
});

describe('useUserContinent - derive le pays de l\'utilisateur connecte', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    geoState.continentByCountry = {};
    authState.user = null;
  });

  it('renvoie null si l\'utilisateur n\'a pas d\'adresse', () => {
    authState.user = {};
    const { result } = renderHook(() => useUserContinent());
    expect(result.current).toBeNull();
    expect(geoState.fetchContinentByPays).not.toHaveBeenCalled();
  });

  it('renvoie le continent en cache sans refetch', () => {
    authState.user = { address: { pays: 'Cameroun' } };
    geoState.continentByCountry = { Cameroun: 'Afrique' };

    const { result } = renderHook(() => useUserContinent());

    expect(result.current).toBe('Afrique');
    expect(geoState.fetchContinentByPays).not.toHaveBeenCalled();
  });

  it('declenche fetchContinentByPays si le continent n\'est pas encore en cache', async () => {
    authState.user = { address: { pays: 'Cameroun' } };

    renderHook(() => useUserContinent());

    await waitFor(() => expect(geoState.fetchContinentByPays).toHaveBeenCalledWith('Cameroun'));
  });
});
