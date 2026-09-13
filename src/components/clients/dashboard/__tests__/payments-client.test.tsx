import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Transaction } from '@/types';

import PaymentsPageClient from '../payments-client';

const mockFetchMine = vi.fn();
const mockUseTransactions = vi.fn();
const mockDownloadInvoice = vi.fn();

vi.mock('@/lib/hooks', () => ({
  useTransactions: () => mockUseTransactions(),
  useCurrencyFormat: () => ({ formatAmount: (amount: string, currency: string) => `${amount} ${currency}` }),
}));

vi.mock('@/lib/api/transactions', () => ({
  transactionsApi: { downloadInvoice: (id: number) => mockDownloadInvoice(id) },
}));

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 1, type: 'boost', provider: 'stripe', paymentMethodFamily: 'card',
    amount: '2.99', currency: 'EUR', status: 'succeeded', refundedAt: null,
    createdAt: '2026-09-01T00:00:00.000Z', ...overrides,
  };
}

describe('payments-client - historique des paiements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un etat vide quand aucun paiement', () => {
    mockUseTransactions.mockReturnValue({
      transactions: [], pagination: null, isLoading: false, error: null, fetchMine: mockFetchMine,
    });

    render(<PaymentsPageClient />);

    expect(screen.getByText(/aucun paiement pour le moment/i)).toBeInTheDocument();
  });

  it('affiche les transactions avec leur statut et montant', () => {
    mockUseTransactions.mockReturnValue({
      transactions: [makeTransaction({ status: 'refunded' })],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      isLoading: false,
      error: null,
      fetchMine: mockFetchMine,
    });

    render(<PaymentsPageClient />);

    expect(screen.getByText('2.99 EUR')).toBeInTheDocument();
    expect(screen.getByText('Remboursée')).toBeInTheDocument();
    expect(screen.getByText('Boost')).toBeInTheDocument();
  });

  it('affiche le message d\'erreur sans afficher la table', () => {
    mockUseTransactions.mockReturnValue({
      transactions: [], pagination: null, isLoading: false, error: 'Erreur reseau', fetchMine: mockFetchMine,
    });

    render(<PaymentsPageClient />);

    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
    expect(screen.queryByText(/aucun paiement/i)).not.toBeInTheDocument();
  });

  it('declenche fetchMine(1, 20) au montage', () => {
    mockUseTransactions.mockReturnValue({
      transactions: [], pagination: null, isLoading: false, error: null, fetchMine: mockFetchMine,
    });

    render(<PaymentsPageClient />);

    expect(mockFetchMine).toHaveBeenCalledWith(1, 20);
  });

  describe('telechargement de facture', () => {
    beforeEach(() => {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      window.URL.revokeObjectURL = vi.fn();
    });

    it.each(['succeeded', 'refunded'] as const)(
      'affiche le bouton Facture pour une transaction %s',
      (status) => {
        mockUseTransactions.mockReturnValue({
          transactions: [makeTransaction({ status })],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
          isLoading: false,
          error: null,
          fetchMine: mockFetchMine,
        });

        render(<PaymentsPageClient />);

        expect(screen.getByRole('button', { name: /facture/i })).toBeInTheDocument();
      }
    );

    it.each(['pending', 'failed', 'canceled'] as const)(
      "n'affiche pas le bouton Facture pour une transaction %s",
      (status) => {
        mockUseTransactions.mockReturnValue({
          transactions: [makeTransaction({ status })],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
          isLoading: false,
          error: null,
          fetchMine: mockFetchMine,
        });

        render(<PaymentsPageClient />);

        expect(screen.queryByRole('button', { name: /facture/i })).not.toBeInTheDocument();
      }
    );

    it('declenche le telechargement du blob retourne par l\'API au clic', async () => {
      const user = userEvent.setup();
      mockDownloadInvoice.mockResolvedValueOnce(new Blob(['%PDF-1.4'], { type: 'application/pdf' }));
      mockUseTransactions.mockReturnValue({
        transactions: [makeTransaction({ id: 7, status: 'succeeded' })],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
        isLoading: false,
        error: null,
        fetchMine: mockFetchMine,
      });

      render(<PaymentsPageClient />);
      await user.click(screen.getByRole('button', { name: /facture/i }));

      await waitFor(() => expect(mockDownloadInvoice).toHaveBeenCalledWith(7));
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});
