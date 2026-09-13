import type { TransactionProvider, TransactionStatus, TransactionType } from './admin';
import type { PaymentMethod } from './subscription';

/**
 * Historique des propres transactions de l'utilisateur (Lot N3) - jamais le champ
 * `user` (reserve a AdminTransaction, groupe de serialisation distinct cote backend).
 */
export interface Transaction {
  id: number;
  type: TransactionType;
  provider: TransactionProvider;
  paymentMethodFamily: PaymentMethod;
  amount: string;
  currency: string;
  status: TransactionStatus;
  refundedAt: string | null;
  createdAt: string;
}
