import type { User } from './user';
import type { Voyage } from './voyage';
import type { Demande } from './demande';

export type PropositionStatut = 'en_attente' | 'acceptee' | 'refusee';

export interface Proposition {
  id: number;
  voyage: Voyage;
  demande: Demande;
  client: User;
  voyageur: User;
  prixParKilo: string;
  commissionProposeePourUnBagage: string;
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
}

export interface RespondPropositionInput {
  action: 'accepter' | 'refuser';
  messageRefus?: string;
}

export interface PropositionWithRelations extends Proposition {
  voyage: Voyage;
  demande: Demande;
  client: User;
  voyageur: User;
}