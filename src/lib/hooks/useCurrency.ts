import { useEffect } from 'react';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useSettingsStore } from '../store';

/**
 * Hook principal pour gérer les devises
 */
export function useCurrency() {
  const currencies = useCurrencyStore((state) => state.currencies);
  const popularCurrencies = useCurrencyStore((state) => state.popularCurrencies);
  const defaultCurrency = useCurrencyStore((state) => state.defaultCurrency);
  const isLoading = useCurrencyStore((state) => state.isLoading);
  const error = useCurrencyStore((state) => state.error);
  
  const fetchCurrencies = useCurrencyStore((state) => state.fetchCurrencies);
  const fetchPopularCurrencies = useCurrencyStore((state) => state.fetchPopularCurrencies);
  const getCurrency = useCurrencyStore((state) => state.getCurrency);
  const convert = useCurrencyStore((state) => state.convert);
  const detectByCountry = useCurrencyStore((state) => state.detectByCountry);
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const updateRates = useCurrencyStore((state) => state.updateRates);
  const clearError = useCurrencyStore((state) => state.clearError);
  
  // Récupérer la devise de l'utilisateur depuis authStore
  const user = useAuthStore((state) => state.user);
  const userCurrency = user?.settings?.devise || defaultCurrency;

  // Charger les devises populaires au montage
  useEffect(() => {
    if (popularCurrencies.length === 0) {
      fetchPopularCurrencies();
    }
  }, [popularCurrencies.length, fetchPopularCurrencies]);

  return {
    // State
    currencies,
    popularCurrencies,
    defaultCurrency,
    userCurrency,
    isLoading,
    error,
    
    // Actions
    fetchCurrencies,
    fetchPopularCurrencies,
    getCurrency,
    convert,
    detectByCountry,
    formatAmount,
    updateRates,
    clearError,
  };
}

/**
 * Hook pour obtenir uniquement la devise de l'utilisateur
 */
export function useUserCurrency() {
  const userSettings = useSettingsStore((state) => state.settings);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const defaultCurrency = useCurrencyStore((state) => state.defaultCurrency);

  const isLoading = useSettingsStore((state) => state.isLoading);

  // Charger les settings si absents
  useEffect(() => {
    if (!userSettings && !isLoading) {
      fetchSettings(); // appel API une seule fois
    }
  }, [userSettings, isLoading, fetchSettings]);

  // Déterminer la devise finale
  const userCurrency = userSettings?.devise ?? defaultCurrency;

  return { userCurrency, isLoading };
}

/**
 * Hook pour charger une devise spécifique
 */
export function useCurrencyByCode(code?: string) {
  const getCurrency = useCurrencyStore((state) => state.getCurrency);
  const currencies = useCurrencyStore((state) => state.currencies);
  const isLoading = useCurrencyStore((state) => state.isLoading);

  useEffect(() => {
    if (code) {
      getCurrency(code);
    }
  }, [code, getCurrency]);

  const currency = code 
    ? currencies.find(c => c.code === code.toUpperCase()) 
    : null;

  return {
    currency,
    isLoading,
  };
}