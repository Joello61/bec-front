/**
 * Types pour l'entité Address
 */

export interface Address {
  id: number;
  
  // Champs communs
  pays: string;
  ville: string;
  
  // Format Afrique
  quartier: string | null;
  
  // Format Diaspora
  adresseLigne1: string | null;
  adresseLigne2: string | null;
  codePostal: string | null;
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  lastModifiedAt: string | null;
}

/**
 * Type pour la modification d'adresse
 */
export interface UpdateAddressInput {
  pays: string;
  ville: string;
  quartier?: string;
  adresseLigne1?: string;
  adresseLigne2?: string;
  codePostal?: string;
}

/**
 * Informations sur la possibilité de modifier l'adresse
 */
export interface AddressModificationInfo {
  canModify: boolean;
  hasAddress: boolean;
  lastModifiedAt?: string | null;
  nextModificationDate?: string | null;
  daysRemaining?: number;
  message: string;
}

/**
 * Réponse API après mise à jour d'adresse
 */
export interface UpdateAddressResponse {
  success: true;
  message: string;
  address: Address;
  nextModificationDate: string | null;
}

/**
 * Type d'adresse
 */
export type AddressType = 'african' | 'postal' | null;