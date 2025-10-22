import type { User } from './user';
import type { Demande } from './demande';
import type { Voyage } from './voyage';
import type { ConvertedAmount } from './currency';

export type PropositionStatut = 'en_attente' | 'acceptee' | 'refusee' | 'annulee';

export interface Proposition {
  id: number;
  voyage: Voyage;
  demande: Demande;
  client: User;
  voyageur: User;
  prixParKilo: string;
  commissionProposeePourUnBagage: string;
  
  // ==================== DEVISE ====================
  currency: string; // ⬅️ Code devise (toujours celle de la demande)
  viewerCurrency?: string; // ⬅️ Devise de l'utilisateur qui consulte
  converted?: ConvertedAmount; // ⬅️ Montants convertis
  
  message: string | null;
  statut: PropositionStatut;
  messageRefus: string | null;
  createdAt: string;
  updatedAt: string;
  reponduAt: string | null;
}

export interface CreatePropositionInput {
  demandeId: number;
  prixParKilo: number;
  commissionProposeePourUnBagage: number;
  message?: string;
  // ⚠️ PAS de champ currency - géré automatiquement par le backend
}

export interface RespondPropositionInput {
  action: 'accepter' | 'refuser';
  messageRefus?: string;
}