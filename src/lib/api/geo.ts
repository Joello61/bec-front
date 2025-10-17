import apiClient from './client';
import { endpoints } from './endpoints';
import type { Country, City } from '@/types/geo';

export const geoApi = {
  /**
   * Récupère tous les pays
   * GET /api/geo/countries
   */
  async getCountries(): Promise<Country[]> {
    const response = await apiClient.get<Country[]>(endpoints.geo.countries);
    return response.data;
  },

  /**
   * Récupère les villes d'un pays (top 100)
   * GET /api/geo/cities?country=France
   * @param countryName - Nom français du pays (ex: "France", "Cameroun")
   */
  async getCities(countryName: string): Promise<City[]> {
    const response = await apiClient.get<City[]>(endpoints.geo.cities, {
      params: { country: countryName },
    });
    return response.data;
  },

  /**
   * Recherche de villes dans un pays (autocomplete)
   * GET /api/geo/cities/search?country=France&q=pari
   * @param countryName - Nom français du pays
   * @param query - Terme de recherche (min 2 caractères)
   */
  async searchCities(countryName: string, query: string): Promise<City[]> {
    if (query.length < 2) {
      return [];
    }

    const response = await apiClient.get<City[]>(endpoints.geo.searchCities, {
      params: { 
        country: countryName,
        q: query,
      },
    });
    return response.data;
  },
};