'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

import RefundConfirmModal from '@/components/admin/transactions/RefundConfirmModal';
import { LoadingSpinner, Pagination } from '@/components/common';
import { useAdmin, useCurrencyFormat } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import type { AdminTransaction, AdminTransactionFilters, TransactionStatus, TransactionType } from '@/types';

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: 'En attente',
  succeeded: 'Réussie',
  failed: 'Échouée',
  canceled: 'Annulée',
  refunded: 'Remboursée',
};

const STATUS_STYLES: Record<TransactionStatus, string> = {
  pending: 'bg-warning/10 text-warning',
  succeeded: 'bg-success/10 text-success',
  failed: 'bg-error/10 text-error',
  canceled: 'bg-gray-100 text-gray-500',
  refunded: 'bg-gray-100 text-gray-500',
};

const TYPE_LABELS: Record<TransactionType, string> = {
  subscription_initial: 'Abonnement (initial)',
  subscription_renewal: 'Abonnement (renouvellement)',
  boost: 'Boost',
};

export default function AdminTransactionsPageClient() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminTransactionFilters>({});
  const [refunding, setRefunding] = useState<AdminTransaction | null>(null);

  const { transactions, transactionsPagination, isLoading, error, fetchTransactions } = useAdmin();
  const { formatAmount } = useCurrencyFormat();

  useEffect(() => {
    fetchTransactions(page, 20, filters);
  }, [page, filters, fetchTransactions]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500 mt-1">Paiements des abonnements et boosts, remboursements</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-3">
        <select
          value={filters.status ?? ''}
          onChange={(e) => {
            setFilters((f) => ({ ...f, status: (e.target.value || undefined) as TransactionStatus | undefined }));
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.type ?? ''}
          onChange={(e) => {
            setFilters((f) => ({ ...f, type: (e.target.value || undefined) as TransactionType | undefined }));
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        {isLoading && transactions.length === 0 ? (
          <LoadingSpinner text="Chargement des transactions..." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Utilisateur</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Montant</th>
                <th className="pb-3 pr-4">Moyen</th>
                <th className="pb-3 pr-4">Statut</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900">
                      {transaction.user.prenom} {transaction.user.nom}
                    </div>
                    <div className="text-xs text-gray-500">{transaction.user.email}</div>
                  </td>
                  <td className="py-3 pr-4">{TYPE_LABELS[transaction.type]}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </td>
                  <td className="py-3 pr-4">{transaction.paymentMethodFamily === 'card' ? 'Carte' : 'Mobile Money'}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_STYLES[transaction.status])}>
                      {STATUS_LABELS[transaction.status]}
                    </span>
                  </td>
                  <td className="py-3">
                    {transaction.status === 'succeeded' && (
                      <button
                        onClick={() => setRefunding(transaction)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-error text-error rounded-lg hover:bg-error/10 transition-colors text-xs font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Rembourser
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {transactionsPagination && (
          <div className="mt-6">
            <Pagination
              currentPage={transactionsPagination.page}
              totalPages={transactionsPagination.pages}
              totalItems={transactionsPagination.total}
              itemsPerPage={transactionsPagination.limit}
              itemLabel="transaction"
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {refunding && (
        <RefundConfirmModal
          transaction={refunding}
          onClose={() => setRefunding(null)}
          onSuccess={() => setRefunding(null)}
        />
      )}
    </div>
  );
}
