import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, Currency } from '@/types';

vi.mock('@/lib/api/currencies', () => ({
  currenciesApi: {
    getByCode: vi.fn(),
    convert: vi.fn(),
  },
}));

import { currenciesApi } from '@/lib/api/currencies';

import { useCurrencyStore } from '../currencyStore';

const initialState = useCurrencyStore.getState();

const eur = { code: 'EUR', decimals: 2, symbol: '€' } as Currency;

beforeEach(() => {
  useCurrencyStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('currencyStore.getCurrency', () => {
  it('sert le cache local sans appeler l\'API si la devise est deja connue', async () => {
    useCurrencyStore.setState({ currencies: [eur] });

    const result = await useCurrencyStore.getState().getCurrency('eur');

    expect(result).toBe(eur);
    expect(currenciesApi.getByCode).not.toHaveBeenCalled();
  });

  it('retourne null (pas une exception) en cas d\'echec API', async () => {
    vi.mocked(currenciesApi.getByCode).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    const result = await useCurrencyStore.getState().getCurrency('XAF');

    expect(result).toBeNull();
    expect(useCurrencyStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur' });
  });
});

describe('currencyStore.convert', () => {
  it('court-circuite l\'appel API quand les deux devises sont identiques', async () => {
    useCurrencyStore.setState({ currencies: [eur] });

    const result = await useCurrencyStore.getState().convert(10, 'eur', 'EUR');

    expect(result).toMatchObject({ originalAmount: 10, convertedAmount: 10, exchangeRate: '1.000000' });
    expect(currenciesApi.convert).not.toHaveBeenCalled();
  });

  it('retourne null en cas d\'echec de conversion', async () => {
    vi.mocked(currenciesApi.convert).mockRejectedValue({ success: false, message: 'Erreur' } as ApiError);

    const result = await useCurrencyStore.getState().convert(10, 'EUR', 'USD');

    expect(result).toBeNull();
  });
});
