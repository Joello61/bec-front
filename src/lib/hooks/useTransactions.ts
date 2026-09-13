import { useTransactionStore } from '@/lib/store';

/**
 * Historique des propres transactions de l'utilisateur (Lot N3) - pas d'auto-fetch au
 * montage (la pagination est pilotee par la page appelante, meme patron que useAdmin()
 * pour fetchTransactions).
 */
export function useTransactions() {
  const transactions = useTransactionStore((state) => state.transactions);
  const pagination = useTransactionStore((state) => state.pagination);
  const isLoading = useTransactionStore((state) => state.isLoading);
  const error = useTransactionStore((state) => state.error);
  const fetchMine = useTransactionStore((state) => state.fetchMine);

  return { transactions, pagination, isLoading, error, fetchMine };
}
