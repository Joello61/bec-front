import type { Demande } from './demande';
import type { User } from './user';
import type { Voyage } from './voyage';

export interface Favori {
  id: number;
  user: User;
  voyage: Voyage | null;
  demande: Demande | null;
  createdAt: string;
}