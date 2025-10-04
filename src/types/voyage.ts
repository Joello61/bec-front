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
  description?: string;
}

export interface UpdateVoyageInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateDepart?: string;
  dateArrivee?: string;
  poidsDisponible?: number;
  description?: string;
}

export interface VoyageFilters {
  villeDepart?: string;
  villeArrivee?: string;
  dateDepart?: string;
  statut?: VoyageStatut;
}