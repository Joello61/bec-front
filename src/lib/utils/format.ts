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
 * Formate un prix en FCFA
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(price);
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
 * Capitalise la première lettre
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formate un statut en français
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    actif: 'Actif',
    complet: 'Complet',
    termine: 'Terminé',
    annule: 'Annulé',
    en_recherche: 'En recherche',
    voyageur_trouve: 'Voyageur trouvé',
    annulee: 'Annulée',
    en_attente: 'En attente',
    traite: 'Traité',
    rejete: 'Rejeté',
  };
  
  return statusMap[status] || capitalize(status);
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
 * Vérifie si une date est passée
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Génère une couleur aléatoire pour les avatars
 */
export function getAvatarColor(seed: string): string {
  const colors = [
    '#00695c', // primary
    '#004d40', // primary-dark
    '#26a69a', // primary-light
    '#0d47a1', // info
    '#1976d2', // info-light
    '#616161', // gray-600
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}