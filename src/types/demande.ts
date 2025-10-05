import type { User } from './user';

export type DemandeStatut = 'en_recherche' | 'voyageur_trouve' | 'annulee';

export interface Demande {
  id: number;
  client: User;
  villeDepart: string;
  villeArrivee: string;
  dateLimite: string | null;
  poidsEstime: string;
  prixParKilo: string | null; // ⬅️ AJOUT
  commissionProposeePourUnBagage: string | null; // ⬅️ AJOUT
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
  prixParKilo?: number; // ⬅️ AJOUT
  commissionProposeePourUnBagage?: number; // ⬅️ AJOUT
  description: string;
}

export interface UpdateDemandeInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateLimite?: string;
  poidsEstime?: number;
  prixParKilo?: number; // ⬅️ AJOUT
  commissionProposeePourUnBagage?: number; // ⬅️ AJOUT
  description?: string;
}

export interface DemandeFilters {
  villeDepart?: string;
  villeArrivee?: string;
  statut?: DemandeStatut;
}

// ⬅️ AJOUT : Type pour les demandes matchées avec score
export interface DemandeWithScore {
  demande: Demande;
  score: number;
}