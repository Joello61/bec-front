import apiClient from './client';
import { endpoints } from './endpoints';
import type {
  Currency,
  CurrenciesListResponse,
  CurrencyResponse,
  ConvertResponse,
  DetectCurrencyResponse,
  FormatResponse,
  DefaultCurrencyResponse,
} from '@/types';

export const currenciesApi = {
  /**
   * Récupérer toutes les devises actives
   */
  async getAll(): Promise<Currency[]> {
    const response = await apiClient.get<CurrenciesListResponse>(endpoints.currencies.list);
    return response.data.data;
  },

  /**
   * Récupérer les devises les plus utilisées
   */
  async getPopular(limit = 5): Promise<Currency[]> {
    const response = await apiClient.get<CurrenciesListResponse>(
      endpoints.currencies.popular,
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Récupérer une devise par son code
   */
  async getByCode(code: string): Promise<Currency> {
    const response = await apiClient.get<CurrencyResponse>(
      endpoints.currencies.show(code.toUpperCase())
    );
    return response.data.data;
  },

  /**
   * Convertir un montant d'une devise vers une autre
   */
  async convert(amount: number, from: string, to: string): Promise<ConvertResponse['data']> {
    const response = await apiClient.get<ConvertResponse>(endpoints.currencies.convert, {
      params: {
        amount,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
      },
    });
    return response.data.data;
  },

  /**
   * Détecter la devise selon un pays
   */
  async detectByCountry(country: string): Promise<DetectCurrencyResponse['data']> {
    const response = await apiClient.post<DetectCurrencyResponse>(
      endpoints.currencies.detectByCountry,
      { country }
    );
    return response.data.data;
  },

  /**
   * Formater un montant selon une devise
   */
  async format(amount: number, currency: string): Promise<string> {
    const response = await apiClient.get<FormatResponse>(endpoints.currencies.format, {
      params: { amount, currency: currency.toUpperCase() },
    });
    return response.data.data.formatted;
  },

  /**
   * Récupérer la devise par défaut
   */
  async getDefault(): Promise<{ code: string; currency: Currency }> {
    const response = await apiClient.get<DefaultCurrencyResponse>(
      endpoints.currencies.default
    );
    return response.data.data;
  },

  /**
   * Mettre à jour les taux de change (Admin/Cron)
   */
  async updateRates(): Promise<void> {
    await apiClient.post(endpoints.currencies.updateRates);
  },

  /**
   * Conversion par lot (batch)
   */
  async convertBatch(
    conversions: Array<{ amount: number; from: string; to: string }>
  ): Promise<ConvertResponse['data'][]> {
    const response = await apiClient.post<{ success: boolean; data: ConvertResponse['data'][] }>(
      endpoints.currencies.convertBatch,
      { conversions }
    );
    return response.data.data;
  },
};