import type { User } from './user';
import type { Voyage } from './voyage';
import type { Demande } from './demande';

export interface Favori {
  id: number;
  user: User;
  voyage: Voyage | null;
  demande: Demande | null;
  createdAt: string;
}