/**
 * Types pour le système de gestion des devises
 */

// ==================== DEVISE ====================

/**
 * Interface principale pour une devise
 */
export interface Currency {
  id: number;
  code: string; // EUR, USD, XAF, CAD, GBP, etc.
  name: string; // "Euro", "US Dollar", "CFA Franc", etc.
  symbol: string; // €, $, FCFA, etc.
  decimals: number; // 2 pour EUR/USD, 0 pour XAF
  exchangeRate: string; // Taux par rapport à EUR (base = 1)
  isActive: boolean;
  countries: string[]; // Codes pays ISO (FR, CM, US, etc.)
  rateUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Montants convertis d'une entité vers une devise cible
 */
export interface ConvertedAmount {
  originalCurrency: string; // Ex: "XAF"
  targetCurrency: string; // Ex: "EUR"
  
  // Prix par kilo
  prixParKilo?: number;
  prixParKiloFormatted?: string; // Ex: "76,22 €"
  
  // Commission
  commission?: number;
  commissionFormatted?: string; // Ex: "152,44 €"
}

/**
 * Informations de conversion détaillées (retour API /convert)
 */
export interface ConversionInfo {
  originalAmount: number;
  originalCurrency: string;
  originalFormatted: string;
  convertedAmount: number;
  convertedCurrency: string;
  convertedFormatted: string;
  exchangeRate: string;
}

/**
 * Réponse API pour la liste des devises
 */
export interface CurrenciesListResponse {
  success: true;
  data: Currency[];
  count: number;
}

/**
 * Réponse API pour une devise spécifique
 */
export interface CurrencyResponse {
  success: true;
  data: Currency;
}

/**
 * Réponse API pour la conversion
 */
export interface ConvertResponse {
  success: true;
  data: ConversionInfo;
}

/**
 * Réponse API pour la détection de devise par pays
 */
export interface DetectCurrencyResponse {
  success: true;
  data: {
    country: string;
    currencyCode: string;
    currency: Currency;
  };
}

/**
 * Réponse API pour le formatage
 */
export interface FormatResponse {
  success: true;
  data: {
    amount: number;
    currency: string;
    formatted: string;
  };
}

/**
 * Réponse API pour la devise par défaut
 */
export interface DefaultCurrencyResponse {
  success: true;
  data: {
    code: string;
    currency: Currency;
  };
}