import type { ConvertedAmount } from './currency'; // <- AJOUT
import type { User } from './user';

export type DemandeStatut = 'en_recherche' | 'voyageur_trouve' | 'annulee' | 'expiree';

export interface Demande {
  id: number;
  client: User;
  villeDepart: string;
  villeArrivee: string;
  dateLimite: string;
  poidsEstime: string;
  prixParKilo: string | null;
  commissionProposeePourUnBagage: string | null;
  
  // ==================== DEVISE ====================
  currency: string; // <- AJOUT - Code devise (EUR, XAF, USD)
  viewerCurrency?: string; // <- AJOUT - Devise de l'utilisateur qui consulte
  converted?: ConvertedAmount; // <- AJOUT - Montants convertis
  
  description: string;
  statut: DemandeStatut;
  isCurrentlyBoosted: boolean;
  createdAt: string;
  updatedAt: string;

  // ==================== COMPTEUR DE VUES (Lot 6.2) ====================
  // Presents uniquement pour le proprietaire (jamais pour un tiers) - nombreVues si son
  // plan a droit aux statistiques de vues, nombreVuesLocked sinon (upsell).
  nombreVues?: number;
  nombreVuesLocked?: boolean;
}

export interface PublicDemande {
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateLimite: string;
  poidsEstime: string;
  prixParKilo: string | null;
  commissionProposeePourUnBagage: string | null;

  // ==================== DEVISE ====================
  currency: string; // <- AJOUT - Code devise (EUR, XAF, USD)

  description: string;
  isCurrentlyBoosted: boolean;
}

export interface CreateDemandeInput {
  villeDepart: string;
  villeArrivee: string;
  dateLimite?: string;
  poidsEstime: number;
  prixParKilo?: number;
  commissionProposeePourUnBagage?: number;
  description: string;
  // PAS de champ currency - géré automatiquement par le backend
}

export interface UpdateDemandeInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateLimite?: string;
  poidsEstime?: number;
  prixParKilo?: number;
  commissionProposeePourUnBagage?: number;
  description?: string;
  // PAS de champ currency - non modifiable
}

export interface DemandeFilters {
  villeDepart?: string;
  villeArrivee?: string;
  statut?: DemandeStatut;
  dateLimite?: string;
}

export interface DemandeWithScore {
  demande: Demande;
  score: number;
}