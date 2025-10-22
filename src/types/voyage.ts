import type { User } from './user';
import type { ConvertedAmount } from './currency'; // ⬅️ AJOUT

export type VoyageStatut = 'actif' | 'complete' | 'en_cours' | 'annule' | 'expire';

export interface Voyage {
  id: number;
  voyageur: User;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  dateArrivee: string;
  poidsDisponible: string;
  poidsDisponibleRestant  : string;
  prixParKilo: string | null;
  commissionProposeePourUnBagage: string | null;
  
  // ==================== DEVISE ====================
  currency: string; // ⬅️ AJOUT - Code devise (EUR, XAF, USD)
  viewerCurrency?: string; // ⬅️ AJOUT - Devise de l'utilisateur qui consulte
  converted?: ConvertedAmount; // ⬅️ AJOUT - Montants convertis
  
  description: string | null;
  statut: VoyageStatut;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoyageInput {
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  dateArrivee: string;
  poidsDisponible: number;
  prixParKilo?: number;
  commissionProposeePourUnBagage?: number;
  description?: string;
  // ⚠️ PAS de champ currency - géré automatiquement par le backend
}

export interface UpdateVoyageInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateDepart?: string;
  dateArrivee?: string;
  poidsDisponible?: number;
  prixParKilo?: number;
  commissionProposeePourUnBagage?: number;
  description?: string;
  // ⚠️ PAS de champ currency - non modifiable
}

export interface VoyageFilters {
  villeDepart?: string;
  villeArrivee?: string;
  dateDepart?: string;
  statut?: VoyageStatut;
}

export interface VoyageWithScore {
  voyage: Voyage;
  score: number;
}