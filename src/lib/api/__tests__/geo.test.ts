import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: { get: vi.fn() },
}));

import apiClient from '../client';
import { geoApi } from '../geo';

describe('geoApi.searchCities / searchCitiesGlobal - garde-fous reels', () => {
  it('searchCities ne fait pas d\'appel API et renvoie [] pour une recherche de moins de 2 caracteres', async () => {
    const result = await geoApi.searchCities('France', 'p');

    expect(result).toEqual([]);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('searchCities appelle l\'API a partir de 2 caracteres', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [{ nom: 'Paris' }] });

    await geoApi.searchCities('France', 'pa');

    expect(apiClient.get).toHaveBeenCalledWith('/geo/cities/search', { params: { country: 'France', q: 'pa' } });
  });

  it('searchCitiesGlobal ne fait pas d\'appel API pour une recherche de moins de 2 caracteres', async () => {
    const result = await geoApi.searchCitiesGlobal('p');

    expect(result).toEqual([]);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('searchCitiesGlobal plafonne la limite a 100 meme si une valeur superieure est demandee', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });

    await geoApi.searchCitiesGlobal('paris', 500);

    expect(apiClient.get).toHaveBeenCalledWith('/geo/cities/search-global', { params: { q: 'paris', limit: 100 } });
  });

  it('searchCitiesGlobal respecte une limite inferieure a 100', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });

    await geoApi.searchCitiesGlobal('paris', 10);

    expect(apiClient.get).toHaveBeenCalledWith('/geo/cities/search-global', { params: { q: 'paris', limit: 10 } });
  });
});
