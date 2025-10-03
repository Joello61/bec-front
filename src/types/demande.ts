import type { User } from './user';

export type DemandeStatut = 'en_recherche' | 'voyageur_trouve' | 'annulee';

export interface Demande {
  id: number;
  client: User;
  villeDepart: string;
  villeArrivee: string;
  dateLimite: string | null;
  poidsEstime: string;
  description: string;
  statut: DemandeStatut;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDemandeInput {
  villeDepart: string;
  villeArrivee: string;
  dateLimite?: string;
  poidsEstime: number;
  description: string;
}

export interface UpdateDemandeInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateLimite?: string;
  poidsEstime?: number;
  description?: string;
}

export interface DemandeFilters {
  villeDepart?: string;
  villeArrivee?: string;
  statut?: DemandeStatut;
}