import type { User } from './user';
import type { Voyage } from './voyage';

export interface Avis {
  id: number;
  auteur: User;
  cible: User;
  voyage: Voyage | null;
  note: number;
  commentaire: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvisInput {
  cibleId: number;
  voyageId?: number;
  note: number;
  commentaire?: string;
}

export interface AvisStats {
  total: number;
  average: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface AvisWithStats {
  avis: Avis[];
  stats: AvisStats;
}