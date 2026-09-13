import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Transaction } from '@/types';

import PaymentsPageClient from '../payments-client';

const mockFetchMine = vi.fn();
const mockUseTransactions = vi.fn();

vi.mock('@/lib/hooks', () => ({
  useTransactions: () => mockUseTransactions(),
  useCurrencyFormat: () => ({ formatAmount: (amount: string, currency: string) => `${amount} ${currency}` }),
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
});
