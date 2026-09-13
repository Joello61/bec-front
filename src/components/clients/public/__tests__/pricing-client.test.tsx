import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/lib/utils/constants';
import type { BoostOffer, SubscriptionPlan } from '@/types';

import PricingPageClient from '../pricing-client';

const mockPush = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useCurrencyFormat: () => ({ formatAmount: (amount: string) => `${amount} EUR` }),
}));

function makePlan(overrides: Partial<SubscriptionPlan> = {}): SubscriptionPlan {
  return {
    id: 1, code: 'plus', name: 'Plus', priceAmountEur: '4.99', priceAmountXaf: '3000.00',
    priceAmountEurYearly: null, priceAmountXafYearly: null, billingPeriod: 'monthly',
    maxActiveVoyages: null, maxActiveDemandes: null, hasBadge: true, hasViewStats: false,
    isFeatured: false, isActive: true, sortOrder: 1, ...overrides,
  };
}

function makeOffer(overrides: Partial<BoostOffer> = {}): BoostOffer {
  return {
    id: 1, name: 'Boost 7 jours', durationDays: 7, priceAmountEur: '2.99',
    priceAmountXaf: '2000.00', isFeatured: true, isActive: true, sortOrder: 0, ...overrides,
  };
}

describe('pricing-client - CTA selon authentification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirige un visiteur non connecte vers l\'inscription avec ?redirect= vers la page abonnement', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(<PricingPageClient plans={[makePlan()]} offers={[]} />);
    await user.click(screen.getByRole('button', { name: /commencer/i }));

    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.REGISTER}?redirect=${encodeURIComponent(ROUTES.SUBSCRIPTION)}`
    );
  });

  it('redirige un utilisateur deja connecte directement vers la page abonnement', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(<PricingPageClient plans={[makePlan()]} offers={[]} />);
    await user.click(screen.getByRole('button', { name: /commencer/i }));

    expect(mockPush).toHaveBeenCalledWith(ROUTES.SUBSCRIPTION);
  });

  it('affiche les offres de boost quand il y en a', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<PricingPageClient plans={[]} offers={[makeOffer()]} />);
    expect(screen.getByText('Boost 7 jours')).toBeInTheDocument();
  });

  it("n'affiche pas la section boost quand il n'y a aucune offre", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<PricingPageClient plans={[makePlan()]} offers={[]} />);
    expect(screen.queryByText(/boostez la visibilité/i)).not.toBeInTheDocument();
  });
});
