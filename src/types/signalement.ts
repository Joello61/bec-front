import type { User } from './user';
import type { Voyage } from './voyage';
import type { Demande } from './demande';
import { Message } from './message';

export type SignalementMotif = 
  | 'contenu_inapproprie' 
  | 'spam' 
  | 'arnaque' 
  | 'objet_illegal' 
  | 'autre';

export type SignalementStatut = 'en_attente' | 'traite' | 'rejete';

export interface Signalement {
  id: number;
  signaleur: User;
  voyage: Voyage | null;
  demande: Demande | null;
  utilisateurSignale: User | null;
  message: Message | null;
  motif: SignalementMotif;
  description: string;
  statut: SignalementStatut;
  reponseAdmin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSignalementInput {
  voyageId?: number;
  demandeId?: number;
  messageId?: number;
  utilisateurSignaleId?: number;
  motif: SignalementMotif;
  description: string;
}

export interface TraiterSignalementInput {
  statut: 'traite' | 'rejete';
  reponseAdmin?: string;
}