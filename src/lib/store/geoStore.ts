/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { geoApi } from '@/lib/api/geo';
import type { Country, City } from '@/types/geo';

interface GeoState {
  // Données
  countries: Country[];
  cities: Record<string, City[]>;
  
  // États de chargement (pour usage interne uniquement)
  isLoadingCountries: boolean;
  isLoadingCities: boolean;
  
  // Erreurs
  error: string | null;

  // Actions
  fetchCountries: () => Promise<void>;
  fetchCities: (countryName: string) => Promise<void>;
  searchCities: (countryName: string, query: string) => Promise<City[]>;
  clearError: () => void;
  reset: () => void;
}

export const useGeoStore = create<GeoState>((set, get) => ({
  // État initial
  countries: [],
  cities: {},
  isLoadingCountries: false,
  isLoadingCities: false,
  error: null,

  /**
   * Récupère tous les pays (une seule fois)
   */
  fetchCountries: async () => {
    const state = get();
    
    // ✅ Triple protection
    if (state.countries.length > 0) return;
    if (state.isLoadingCountries) return;

    set({ isLoadingCountries: true, error: null });
    
    try {
      const countries = await geoApi.getCountries();
      set({ 
        countries,
        isLoadingCountries: false,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des pays',
        isLoadingCountries: false,
      });
    }
  },

  /**
   * Récupère les villes d'un pays (top 100)
   */
  fetchCities: async (countryName: string) => {
    const state = get();
    
    // ✅ Protection contre les appels multiples
    if (state.cities[countryName]) return; // Déjà en cache
    if (state.isLoadingCities) return; // Déjà en cours

    set({ isLoadingCities: true, error: null });
    
    try {
      const cities = await geoApi.getCities(countryName);
      
      // ✅ Mise à jour atomique
      set((currentState) => ({ 
        cities: {
          ...currentState.cities,
          [countryName]: cities,
        },
        isLoadingCities: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des villes',
        isLoadingCities: false,
      });
    }
  },

  /**
   * Recherche de villes (autocomplete)
   */
  searchCities: async (countryName: string, query: string) => {
    if (query.length < 2) {
      return [];
    }

    const state = get();
    
    // ✅ Ne pas bloquer si recherche en cours
    if (state.isLoadingCities) {
      return [];
    }

    set({ isLoadingCities: true, error: null });
    
    try {
      const cities = await geoApi.searchCities(countryName, query);
      set({ isLoadingCities: false });
      return cities;
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la recherche',
        isLoadingCities: false,
      });
      return [];
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({ 
    countries: [],
    cities: {},
    isLoadingCountries: false,
    isLoadingCities: false,
    error: null,
  }),
}));