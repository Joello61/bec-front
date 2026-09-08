import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from '../client';
import { currenciesApi } from '../currencies';

describe('currenciesApi - transformations reelles (pas de simple passthrough)', () => {
  it('getAll deballe la double enveloppe {data: {data: [...]}} de la reponse', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: [{ code: 'XAF' }] } });

    const result = await currenciesApi.getAll();

    expect(result).toEqual([{ code: 'XAF' }]);
  });

  it('convert met en majuscules les codes devise avant de les envoyer', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: { amount: 100 } } });

    await currenciesApi.convert(100, 'xaf', 'eur');

    expect(apiClient.get).toHaveBeenCalledWith('/currencies/convert', {
      params: { amount: 100, from: 'XAF', to: 'EUR' },
    });
  });

  it('getByCode met en majuscules le code devise dans l\'URL', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: { code: 'USD' } } });

    await currenciesApi.getByCode('usd');

    expect(apiClient.get).toHaveBeenCalledWith('/currencies/USD');
  });

  it('format extrait uniquement le champ formatted de la reponse', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: { formatted: '1 000 FCFA' } } });

    const result = await currenciesApi.format(1000, 'xaf');

    expect(result).toBe('1 000 FCFA');
    expect(apiClient.get).toHaveBeenCalledWith('/currencies/format', { params: { amount: 1000, currency: 'XAF' } });
  });
});
