'use client';

import { Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { LoadingSpinner, Pagination, useToast } from '@/components/common';
import { transactionsApi } from '@/lib/api/transactions';
import { useCurrencyFormat, useTransactions } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/utils/constants';
import { logger } from '@/lib/utils/logger';
import type { Transaction, TransactionStatus, TransactionType } from '@/types';

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

const INVOICE_ELIGIBLE_STATUSES: TransactionStatus[] = ['succeeded', 'refunded'];

export default function PaymentsPageClient() {
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const { transactions, pagination, isLoading, error, fetchMine } = useTransactions();
  const { formatAmount } = useCurrencyFormat();
  const toast = useToast();

  useEffect(() => {
    fetchMine(page, 20);
  }, [page, fetchMine]);

  const handleDownloadInvoice = async (transaction: Transaction) => {
    setDownloadingId(transaction.id);
    try {
      const blob = await transactionsApi.downloadInvoice(transaction.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${transaction.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error('Impossible de télécharger la facture pour le moment.');
      logger.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="container-custom py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Historique des paiements</h1>
        <p className="text-gray-600">
          Vos paiements d&apos;abonnement et de boost. Voir aussi votre{' '}
          <Link href={ROUTES.SUBSCRIPTION} className="text-primary hover:underline">
            abonnement
          </Link>
          .
        </p>
      </div>

      {error && (
        <div className="text-center py-8">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      )}

      {!error && (
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          {isLoading && transactions.length === 0 ? (
            <LoadingSpinner text="Chargement de vos paiements..." />
          ) : transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun paiement pour le moment.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-3 pr-4">Date</th>
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
                    <td className="py-3 pr-4">{TYPE_LABELS[transaction.type]}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>
                    <td className="py-3 pr-4">
                      {transaction.paymentMethodFamily === 'card' ? 'Carte' : 'Mobile Money'}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_STYLES[transaction.status])}>
                        {STATUS_LABELS[transaction.status]}
                      </span>
                    </td>
                    <td className="py-3">
                      {INVOICE_ELIGIBLE_STATUSES.includes(transaction.status) && (
                        <button
                          onClick={() => handleDownloadInvoice(transaction)}
                          disabled={downloadingId === transaction.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium disabled:opacity-50"
                        >
                          {downloadingId === transaction.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          Facture
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                itemLabel="paiement"
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
