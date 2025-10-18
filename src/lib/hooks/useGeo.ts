import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useGeoStore } from '@/lib/store';
import type { City, CityGlobal } from '@/types/geo';

/* ———————————————————————————————— */
/* Hook pour charger et accéder aux pays */
/* ———————————————————————————————— */
export function useCountries() {
  const countries = useGeoStore((state) => state.countries);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    const st = useGeoStore.getState();
    if (st.countries.length > 0) {
      hasFetchedRef.current = true;
      return;
    }
    hasFetchedRef.current = true;
    st.fetchCountries();
  }, []);

  const isLoading = countries.length === 0;

  return {
    countries,
    isLoading,
  };
}

/* ———————————————————————————————— */
/* Hook pour charger les villes d’un pays */
/* ———————————————————————————————— */
const EMPTY_CITIES: ReadonlyArray<City> = Object.freeze([]);

export function useCities(countryName: string | null) {
  // Mémoïsation du sélecteur pour éviter que getSnapshot renvoie une nouvelle fonction
  const selector = useMemo(
    () => (state: ReturnType<typeof useGeoStore.getState>) => {
      if (!countryName) {
        return EMPTY_CITIES;
      }
      return state.cities[countryName] ?? EMPTY_CITIES;
    },
    [countryName]
  );

  const cities = useGeoStore(selector);

  const lastFetchedRef = useRef<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!countryName) return;
    if (lastFetchedRef.current === countryName) return;

    const st = useGeoStore.getState();
    if (st.cities[countryName]) {
      // déjà en cache
      lastFetchedRef.current = countryName;
      return;
    }

    lastFetchedRef.current = countryName;
    setIsFetching(true);
    st.fetchCities(countryName).finally(() => {
      setIsFetching(false);
    });
  }, [countryName]);

  const isLoading = !!countryName && cities.length === 0 && isFetching;

  return { cities, isLoading };
}

/* ———————————————————————————————— */
/* Hook recherche (autocomplete) des villes */
/* ———————————————————————————————— */
export function useCitySearch(countryName: string | null) {
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    async (query: string) => {
      if (!countryName || query.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await useGeoStore.getState().searchCities(countryName, query);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    },
    [countryName]
  );

  useEffect(() => {
    setSearchResults([]);
  }, [countryName]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    isSearching,
    search,
    clearResults,
  };
}

/* ———————————————————————————————— */
/* ✅ NOUVEAU - Hook top 100 mondial */
/* ———————————————————————————————— */
export function useTopCitiesGlobal() {
  const topCitiesGlobal = useGeoStore((state) => state.topCitiesGlobal);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    const st = useGeoStore.getState();
    if (st.topCitiesGlobal.length > 0) {
      hasFetchedRef.current = true;
      return;
    }
    hasFetchedRef.current = true;
    st.fetchTopCitiesGlobal();
  }, []);

  const isLoading = topCitiesGlobal.length === 0;

  return {
    topCitiesGlobal,
    isLoading,
  };
}

/* ———————————————————————————————— */
/* ✅ NOUVEAU - Hook recherche globale */
/* ———————————————————————————————— */
export function useCitySearchGlobal() {
  const [searchResults, setSearchResults] = useState<CityGlobal[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    async (query: string, limit = 50) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await useGeoStore.getState().searchCitiesGlobal(query, limit);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    isSearching,
    search,
    clearResults,
  };
}

/* ———————————————————————————————— */
/* Hook combiné pour gérer pays + villes */
/* ———————————————————————————————— */
export function useGeoData() {
  const { countries, isLoading: isLoadingCountries } = useCountries();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { cities, isLoading: isLoadingCities } = useCities(selectedCountry);

  const selectCountry = useCallback((name: string) => {
    setSelectedCountry(name);
  }, []);

  const resetCountry = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  return {
    countries,
    isLoadingCountries,
    cities,
    isLoadingCities,
    selectedCountry,
    selectCountry,
    resetCountry,
  };
}
