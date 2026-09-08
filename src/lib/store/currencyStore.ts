import { create } from 'zustand';

import { currenciesApi } from '@/lib/api/currencies';
import type { ConversionInfo, Currency } from '@/types';

import { createAsyncAction } from './createAsyncAction';

interface CurrencyState {
  currencies: Currency[];
  popularCurrencies: Currency[];
  defaultCurrency: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCurrencies: () => Promise<void>;
  fetchPopularCurrencies: (limit?: number) => Promise<void>;
  getCurrency: (code: string) => Promise<Currency | null>;
  convert: (amount: number, from: string, to: string) => Promise<ConversionInfo | null>;
  detectByCountry: (country: string) => Promise<string | null>;
  formatAmount: (amount: number, currency: string) => Promise<string | null>;
  updateRates: () => Promise<void>;
  clearError: () => void;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currencies: [],
  popularCurrencies: [],
  defaultCurrency: 'EUR',
  isLoading: false,
  error: null,

  fetchCurrencies: () =>
    createAsyncAction(set, async () => {
      const currencies = await currenciesApi.getAll();
      set({ currencies, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des devises' }),

  fetchPopularCurrencies: (limit = 5) =>
    createAsyncAction(set, async () => {
      const popularCurrencies = await currenciesApi.getPopular(limit);
      set({ popularCurrencies, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des devises populaires' }),

  getCurrency: async (code) => {
    // Chercher d'abord dans le cache local
    const cached = get().currencies.find((c) => c.code === code.toUpperCase());
    if (cached) return cached;

    const currency = await createAsyncAction(set, async () => {
      const currency = await currenciesApi.getByCode(code);
      set((state) => ({
        currencies: [...state.currencies.filter((c) => c.code !== currency.code), currency],
        isLoading: false,
      }));
      return currency;
    }, { fallbackError: 'Erreur lors du chargement de la devise' });
    return currency ?? null;
  },

  convert: async (amount, from, to) => {
    if (from.toUpperCase() === to.toUpperCase()) {
      // Pas de conversion nécessaire
      const currency = await get().getCurrency(from);
      if (!currency) return null;

      return {
        originalAmount: amount,
        originalCurrency: from.toUpperCase(),
        originalFormatted: `${amount.toFixed(currency.decimals)} ${currency.symbol}`,
        convertedAmount: amount,
        convertedCurrency: to.toUpperCase(),
        convertedFormatted: `${amount.toFixed(currency.decimals)} ${currency.symbol}`,
        exchangeRate: '1.000000',
      };
    }

    const conversionInfo = await createAsyncAction(set, async () => {
      const conversionInfo = await currenciesApi.convert(amount, from, to);
      set({ isLoading: false });
      return conversionInfo;
    }, { fallbackError: 'Erreur lors de la conversion' });
    return conversionInfo ?? null;
  },

  detectByCountry: async (country) => {
    const currencyCode = await createAsyncAction(set, async () => {
      const result = await currenciesApi.detectByCountry(country);
      set({ isLoading: false });
      return result.currencyCode;
    }, { fallbackError: 'Erreur lors de la détection de la devise' });
    return currencyCode ?? null;
  },

  formatAmount: async (amount, currency) => {
    const formatted = await createAsyncAction(set, async () => {
      const formatted = await currenciesApi.format(amount, currency);
      set({ isLoading: false });
      return formatted;
    }, { fallbackError: 'Erreur lors du formatage' });
    return formatted ?? null;
  },

  updateRates: () =>
    createAsyncAction(set, async () => {
      await currenciesApi.updateRates();
      // Recharger les devises après la mise à jour
      await get().fetchCurrencies();
      set({ isLoading: false });
    }, { fallbackError: 'Erreur lors de la mise à jour des taux' }),

  clearError: () => set({ error: null }),
}));
