import apiClient from './client';
import { endpoints } from './endpoints';
import type { Country, City, CityGlobal, ContinentResponse } from '@/types/geo';

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

  /**
   * Récupère le top 100 des villes mondiales
   * GET /api/geo/cities/top100
   */
  async getTopCitiesGlobal(): Promise<CityGlobal[]> {
    const response = await apiClient.get<CityGlobal[]>(endpoints.geo.topCitiesGlobal);
    return response.data;
  },

  /**
   * Recherche globale de villes (tous pays confondus)
   * GET /api/geo/cities/search-global?q=paris&limit=50
   * @param query - Terme de recherche (min 2 caractères)
   * @param limit - Nombre max de résultats (défaut: 50, max: 100)
   */
  async searchCitiesGlobal(query: string, limit = 50): Promise<CityGlobal[]> {
    if (query.length < 2) {
      return [];
    }

    const response = await apiClient.get<CityGlobal[]>(endpoints.geo.searchCitiesGlobal, {
      params: { 
        q: query,
        limit: Math.min(limit, 100), // Cap à 100
      },
    });
    return response.data;
  },

  /**
   * Voir le continent d'un pays par son nom
   */
  async getContinentPays(pays: string): Promise<ContinentResponse> {
    const response = await apiClient.get<ContinentResponse>(endpoints.geo.continent(pays));
    return response.data;
  },
};