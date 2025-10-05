import type { User } from './user';

export type VoyageStatut = 'actif' | 'complete' | 'en_cours' | 'annule';

export interface Voyage {
  id: number;
  voyageur: User;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  dateArrivee: string;
  poidsDisponible: string;
  prixParKilo: string | null; // ⬅️ AJOUT
  commissionProposeePourUnBagage: string | null; // ⬅️ AJOUT
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
  prixParKilo?: number; // ⬅️ AJOUT
  commissionProposeePourUnBagage?: number; // ⬅️ AJOUT
  description?: string;
}

export interface UpdateVoyageInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateDepart?: string;
  dateArrivee?: string;
  poidsDisponible?: number;
  prixParKilo?: number; // ⬅️ AJOUT
  commissionProposeePourUnBagage?: number; // ⬅️ AJOUT
  description?: string;
}

export interface VoyageFilters {
  villeDepart?: string;
  villeArrivee?: string;
  dateDepart?: string;
  statut?: VoyageStatut;
}

// ⬅️ AJOUT : Type pour les voyages matchés avec score
export interface VoyageWithScore {
  voyage: Voyage;
  score: number;
}