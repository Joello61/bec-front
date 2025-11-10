import type { User } from './user';
import type { ConvertedAmount } from './currency'; // ⬅️ AJOUT

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
  currency: string; // ⬅️ AJOUT - Code devise (EUR, XAF, USD)
  viewerCurrency?: string; // ⬅️ AJOUT - Devise de l'utilisateur qui consulte
  converted?: ConvertedAmount; // ⬅️ AJOUT - Montants convertis
  
  description: string;
  statut: DemandeStatut;
  createdAt: string;
  updatedAt: string;
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
  currency: string; // ⬅️ AJOUT - Code devise (EUR, XAF, USD)

  description: string;
}

export interface CreateDemandeInput {
  villeDepart: string;
  villeArrivee: string;
  dateLimite?: string;
  poidsEstime: number;
  prixParKilo?: number;
  commissionProposeePourUnBagage?: number;
  description: string;
  // ⚠️ PAS de champ currency - géré automatiquement par le backend
}

export interface UpdateDemandeInput {
  villeDepart?: string;
  villeArrivee?: string;
  dateLimite?: string;
  poidsEstime?: number;
  prixParKilo?: number;
  commissionProposeePourUnBagage?: number;
  description?: string;
  // ⚠️ PAS de champ currency - non modifiable
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