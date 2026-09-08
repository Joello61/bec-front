import { create } from 'zustand';

import { geoApi } from '@/lib/api/geo';
import type { City, CityGlobal, Country } from '@/types/geo';

import { createAsyncAction } from './createAsyncAction';

interface GeoState {
  // Données
  countries: Country[];
  cities: Record<string, City[]>;
  topCitiesGlobal: CityGlobal[];
  continentByCountry: Record<string, string>;

  // États de chargement (pour usage interne uniquement)
  isLoadingCountries: boolean;
  isLoadingCities: boolean;
  isLoadingTopGlobal: boolean;
  isLoadingContinent: boolean;

  // Erreurs
  error: string | null;

  // Actions
  fetchCountries: () => Promise<void>;
  fetchCities: (countryName: string) => Promise<void>;
  searchCities: (countryName: string, query: string) => Promise<City[]>;

  fetchTopCitiesGlobal: () => Promise<void>;
  searchCitiesGlobal: (query: string, limit?: number) => Promise<CityGlobal[]>;

  fetchContinentByPays: (pays: string) => Promise<string | null>;

  clearError: () => void;
  reset: () => void;
}

export const useGeoStore = create<GeoState>((set, get) => ({
  // État initial
  countries: [],
  cities: {},
  topCitiesGlobal: [],
  continentByCountry: {},
  isLoadingCountries: false,
  isLoadingCities: false,
  isLoadingTopGlobal: false,
  isLoadingContinent: false,
  error: null,

  /**
   * Récupère tous les pays (une seule fois)
   */
  fetchCountries: () => {
    const state = get();
    // Triple protection (cache + anti double-appel)
    if (state.countries.length > 0 || state.isLoadingCountries) return Promise.resolve();

    return createAsyncAction(set, async () => {
      const countries = await geoApi.getCountries();
      set({ countries, isLoadingCountries: false });
    }, { fallbackError: 'Erreur lors du chargement des pays', loadingKey: 'isLoadingCountries' });
  },

  /**
   * Récupère les villes d'un pays (top 100)
   */
  fetchCities: (countryName: string) => {
    const state = get();
    if (state.cities[countryName] || state.isLoadingCities) return Promise.resolve();

    return createAsyncAction(set, async () => {
      const cities = await geoApi.getCities(countryName);
      set((currentState) => ({
        cities: { ...currentState.cities, [countryName]: cities },
        isLoadingCities: false,
      }));
    }, { fallbackError: 'Erreur lors du chargement des villes', loadingKey: 'isLoadingCities' });
  },

  /**
   * Recherche de villes (autocomplete)
   */
  searchCities: async (countryName: string, query: string) => {
    if (query.length < 2 || get().isLoadingCities) {
      return [];
    }

    const cities = await createAsyncAction(set, async () => {
      const cities = await geoApi.searchCities(countryName, query);
      set({ isLoadingCities: false });
      return cities;
    }, { fallbackError: 'Erreur lors de la recherche', loadingKey: 'isLoadingCities' });
    return cities ?? [];
  },

  /**
   * Récupère le top 100 mondial (une seule fois)
   */
  fetchTopCitiesGlobal: () => {
    const state = get();
    if (state.topCitiesGlobal.length > 0 || state.isLoadingTopGlobal) return Promise.resolve();

    return createAsyncAction(set, async () => {
      const cities = await geoApi.getTopCitiesGlobal();
      set({ topCitiesGlobal: cities, isLoadingTopGlobal: false });
    }, { fallbackError: 'Erreur lors du chargement du top mondial', loadingKey: 'isLoadingTopGlobal' });
  },

  /**
   * Recherche globale de villes (tous pays)
   */
  searchCitiesGlobal: async (query: string, limit = 50) => {
    if (query.length < 2) {
      return [];
    }

    // Ne pas bloquer si recherche en cours (permet recherches multiples)
    if (get().isLoadingCities) {
      return [];
    }

    const cities = await createAsyncAction(set, async () => {
      const cities = await geoApi.searchCitiesGlobal(query, limit);
      set({ isLoadingCities: false });
      return cities;
    }, { fallbackError: 'Erreur lors de la recherche globale', loadingKey: 'isLoadingCities' });
    return cities ?? [];
  },

  fetchContinentByPays: async (pays: string) => {
    const cached = get().continentByCountry[pays];
    if (cached) return cached;

    const continent = await createAsyncAction(set, async () => {
      const data = await geoApi.getContinentPays(pays);
      const continent = data.continent ?? null;
      if (continent) {
        set((current) => ({
          continentByCountry: { ...current.continentByCountry, [pays]: continent },
          isLoadingContinent: false,
        }));
      } else {
        set({ isLoadingContinent: false });
      }
      return continent;
    }, { fallbackError: 'Erreur lors du chargement du continent', loadingKey: 'isLoadingContinent' });
    return continent ?? null;
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    countries: [],
    cities: {},
    topCitiesGlobal: [],
    continentByCountry: {},
    isLoadingCountries: false,
    isLoadingCities: false,
    isLoadingTopGlobal: false,
    isLoadingContinent: false,
    error: null,
  }),
}));
