import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SubscriptionPlan } from '@/types';

import SubscriptionCheckoutModal from '../SubscriptionCheckoutModal';

const mockCheckout = vi.fn();
const mockToastError = vi.fn();

vi.mock('@/lib/hooks', () => ({
  useSubscriptionActions: () => ({ checkout: mockCheckout }),
  useCurrencyFormat: () => ({ formatAmount: (amount: string) => `${amount} €` }),
}));

vi.mock('@/components/common', () => ({
  useToast: () => ({ error: mockToastError, success: vi.fn() }),
}));

const plan = { id: 2, code: 'plus', name: 'Plus', priceAmountEur: '4.99' } as SubscriptionPlan;

describe('SubscriptionCheckoutModal - double consentement (art. L.221-28 13° Code conso)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('bloque la soumission tant qu\'aucune case n\'est cochee', async () => {
    const user = userEvent.setup();
    render(<SubscriptionCheckoutModal plan={plan} onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    expect(mockCheckout).not.toHaveBeenCalled();
    expect(await screen.findByText(/vous devez accepter un accès immédiat/i)).toBeInTheDocument();
    expect(await screen.findByText(/vous devez renoncer expressément/i)).toBeInTheDocument();
  });

  it('bloque la soumission si une seule des deux cases est cochee', async () => {
    const user = userEvent.setup();
    render(<SubscriptionCheckoutModal plan={plan} onClose={vi.fn()} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    expect(mockCheckout).not.toHaveBeenCalled();
    expect(await screen.findByText(/vous devez renoncer expressément/i)).toBeInTheDocument();
  });

  it('soumet le checkout uniquement quand les deux cases sont cochees separement', async () => {
    mockCheckout.mockResolvedValue('https://checkout.stripe.com/session/xyz');
    const assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign: assignSpy },
      writable: true,
    });

    const user = userEvent.setup();
    render(<SubscriptionCheckoutModal plan={plan} onClose={vi.fn()} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    await waitFor(() => expect(mockCheckout).toHaveBeenCalledWith({
      planCode: 'plus',
      accessImmediateConsent: true,
      withdrawalWaiverConsent: true,
    }));
    expect(assignSpy).toHaveBeenCalledWith('https://checkout.stripe.com/session/xyz');
  });

  it('reaffiche une erreur et reactive le formulaire si le checkout echoue', async () => {
    mockCheckout.mockRejectedValue(new Error('Le plan "plus" n\'a pas de Price Stripe configuré'));

    const user = userEvent.setup();
    render(<SubscriptionCheckoutModal plan={plan} onClose={vi.fn()} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Le plan "plus" n\'a pas de Price Stripe configuré'));
    expect(await screen.findByRole('button', { name: /continuer vers le paiement/i })).toBeEnabled();
  });
});
