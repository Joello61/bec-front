import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BoostOffer } from '@/types';

import BoostModal from '../BoostModal';

const mockCheckout = vi.fn();
const mockToastError = vi.fn();

const offers: BoostOffer[] = [
  { id: 1, name: '7 jours', durationDays: 7, priceAmountEur: '2.99', priceAmountXaf: '2000', isFeatured: false, isActive: true, sortOrder: 0 },
  { id: 2, name: '15 jours', durationDays: 15, priceAmountEur: '4.99', priceAmountXaf: null, isFeatured: false, isActive: true, sortOrder: 1 },
];

vi.mock('@/lib/hooks', () => ({
  useBoostOffers: () => ({ offers, isLoading: false }),
  useBoostActions: () => ({ checkout: mockCheckout }),
  useCurrencyFormat: () => ({
    formatAmount: (amount: string, currency: string) => (currency === 'XAF' ? `${amount} FCFA` : `${amount} €`),
  }),
}));

vi.mock('@/components/common', () => ({
  useToast: () => ({ error: mockToastError, success: vi.fn() }),
  LoadingSpinner: () => null,
}));

describe('BoostModal - double consentement (art. L.221-28 13° Code conso)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('bloque la soumission tant qu\'aucune offre ni aucune case n\'est cochee', async () => {
    const user = userEvent.setup();
    render(<BoostModal targetType="voyage" targetId={10} onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    expect(mockCheckout).not.toHaveBeenCalled();
    expect(await screen.findByText(/vous devez accepter un accès immédiat/i)).toBeInTheDocument();
    expect(await screen.findByText(/vous devez renoncer expressément/i)).toBeInTheDocument();
  });

  it('bloque la soumission si une seule des deux cases est cochee', async () => {
    const user = userEvent.setup();
    render(<BoostModal targetType="voyage" targetId={10} onClose={vi.fn()} />);

    await user.click(screen.getByLabelText(/7 jours/i));
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    expect(mockCheckout).not.toHaveBeenCalled();
    expect(await screen.findByText(/vous devez renoncer expressément/i)).toBeInTheDocument();
  });

  it('soumet le checkout avec l\'offre choisie uniquement quand les deux cases sont cochees separement', async () => {
    mockCheckout.mockResolvedValue('https://checkout.stripe.com/session/boost');
    const assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign: assignSpy },
      writable: true,
    });

    const user = userEvent.setup();
    render(<BoostModal targetType="voyage" targetId={10} onClose={vi.fn()} />);

    await user.click(screen.getByLabelText(/15 jours/i));
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    await waitFor(() => expect(mockCheckout).toHaveBeenCalledWith({
      targetType: 'voyage',
      targetId: 10,
      offerId: 2,
      paymentMethod: 'card',
      accessImmediateConsent: true,
      withdrawalWaiverConsent: true,
    }));
    expect(assignSpy).toHaveBeenCalledWith('https://checkout.stripe.com/session/boost');
  });

  it('permet de choisir Mobile Money pour une offre qui a un tarif XAF et transmet ce moyen de paiement', async () => {
    mockCheckout.mockResolvedValue('https://notchpay.co/pay/boost');
    const assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign: assignSpy },
      writable: true,
    });

    const user = userEvent.setup();
    render(<BoostModal targetType="voyage" targetId={10} onClose={vi.fn()} />);

    await user.click(screen.getByLabelText(/7 jours/i));
    await user.click(screen.getByRole('radio', { name: /mobile money/i }));
    expect(await screen.findByText('2000 FCFA')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(screen.getByRole('button', { name: /continuer vers le paiement/i }));

    await waitFor(() => expect(mockCheckout).toHaveBeenCalledWith({
      targetType: 'voyage',
      targetId: 10,
      offerId: 1,
      paymentMethod: 'mobile_money',
      accessImmediateConsent: true,
      withdrawalWaiverConsent: true,
    }));
    expect(assignSpy).toHaveBeenCalledWith('https://notchpay.co/pay/boost');
  });

  it('desactive le choix Mobile Money quand l\'offre selectionnee n\'a pas de tarif XAF configure', async () => {
    const user = userEvent.setup();
    render(<BoostModal targetType="voyage" targetId={10} onClose={vi.fn()} />);

    await user.click(screen.getByLabelText(/15 jours/i));

    expect(screen.getByRole('radio', { name: /mobile money/i })).toBeDisabled();
  });
});
