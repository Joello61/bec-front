import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminTransaction } from '@/types';

import RefundConfirmModal from '../RefundConfirmModal';

const mockRefundTransaction = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({ refundTransaction: mockRefundTransaction }),
}));

function makeTransaction(overrides: Partial<AdminTransaction> = {}): AdminTransaction {
  return {
    id: 7,
    user: { id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John' },
    type: 'boost',
    provider: 'stripe',
    paymentMethodFamily: 'card',
    amount: '2.99',
    currency: 'EUR',
    status: 'succeeded',
    refundedAt: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('RefundConfirmModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('nomme le bon prestataire selon le provider de la transaction', () => {
    render(<RefundConfirmModal transaction={makeTransaction({ provider: 'notchpay' })} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText(/notch pay/i)).toBeInTheDocument();
  });

  it('rembourse sans raison et appelle refundTransaction avec un objet vide', async () => {
    mockRefundTransaction.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<RefundConfirmModal transaction={makeTransaction()} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.click(screen.getByRole('button', { name: /^rembourser$/i }));

    await waitFor(() => expect(mockRefundTransaction).toHaveBeenCalledWith(7, { reason: '' }));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('transmet la raison saisie', async () => {
    mockRefundTransaction.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<RefundConfirmModal transaction={makeTransaction()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/raison/i), 'Erreur de facturation');
    await user.click(screen.getByRole('button', { name: /^rembourser$/i }));

    await waitFor(() => expect(mockRefundTransaction).toHaveBeenCalledWith(7, { reason: 'Erreur de facturation' }));
  });
});
