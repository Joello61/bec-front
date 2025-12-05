/**
 * Utilitaires de formatage de données
 */

/**
 * Formate une date en format français
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('fr-FR', defaultOptions).format(dateObj);
}

/**
 * Formate une date en format court (JJ/MM/AAAA)
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formate une date en format relatif (il y a X jours)
 */
export function formatDateRelative(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'à l\'instant';
  } else if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `il y a ${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `il y a ${diffInDays}j`;
  } else {
    return formatDateShort(dateObj);
  }
}

/**
 * Formate un numéro de téléphone camerounais
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Retirer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: +237 6XX XX XX XX
  if (cleaned.startsWith('237')) {
    const number = cleaned.slice(3);
    return `+237 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
  }
  
  // Format: 6XX XX XX XX
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
}

/**
 * Formate un poids avec unité
 */
export function formatWeight(weight: number | string): string {
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  return `${weightNum.toFixed(1)} kg`;
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Obtient les initiales d'un nom complet
 */
export function getInitials(nom: string, prenom?: string): string {
  if (prenom) {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
  }
  const parts = nom.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return nom.slice(0, 2).toUpperCase();
}

/**
 * Formate un nom complet
 */
export function formatFullName(nom: string, prenom: string): string {
  return `${prenom} ${nom}`;
}

/**
 * Calcule le nombre de jours restants
 */
export function getDaysRemaining(date: string | Date): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Récupère le symbole d'une devise
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    CAD: 'CAD $',
    GBP: '£',
    XAF: 'FCFA',
    XOF: 'FCFA',
    CHF: 'CHF',
    JPY: '¥',
    CNY: '¥',
    AUD: 'AUD $',
    NZD: 'NZD $',
    BRL: 'R$',
    INR: '₹',
    RUB: '₽',
    ZAR: 'R',
    MAD: 'MAD',
    TND: 'TND',
    DZD: 'DZD',
  };
  return symbols[currencyCode.toUpperCase()] || currencyCode;
}

/**
 * Récupère le nombre de décimales pour une devise
 */
export function getCurrencyDecimals(currencyCode: string): number {
  const noDecimalCurrencies = ['XAF', 'XOF', 'JPY', 'KRW'];
  return noDecimalCurrencies.includes(currencyCode.toUpperCase()) ? 0 : 2;
}

/**
 * Formate un montant avec son symbole (version courte)
 */
export function formatPrice(
  amount: number | string,
  currencyCode: string
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '—';

  const decimals = getCurrencyDecimals(currencyCode);
  const symbol = getCurrencySymbol(currencyCode);
  
  if (currencyCode === 'XAF' || currencyCode === 'XOF') {
    return `${numAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} ${symbol}`;
  }

  return `${numAmount.toFixed(decimals)} ${symbol}`;
}

export function formatImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;

  // Vérifie si c'est déjà une URL absolue (http:// ou https://)
  const isAbsolute = /^(https?:)?\/\//i.test(imagePath);
  if (isAbsolute) return imagePath;

  // Base URL du backend
  const baseApiUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

  // Nettoie le chemin pour éviter les doubles slash
  const cleanPath = imagePath.replace(/^\/+/, '');

  return `${baseApiUrl}/${cleanPath}`;
}
