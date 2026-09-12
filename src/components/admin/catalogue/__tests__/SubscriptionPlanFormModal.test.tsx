import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminSubscriptionPlan } from '@/types';

import SubscriptionPlanFormModal from '../SubscriptionPlanFormModal';

const mockCreateSubscriptionPlan = vi.fn();
const mockUpdateSubscriptionPlan = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({
    createSubscriptionPlan: mockCreateSubscriptionPlan,
    updateSubscriptionPlan: mockUpdateSubscriptionPlan,
  }),
}));

function makePlan(overrides: Partial<AdminSubscriptionPlan> = {}): AdminSubscriptionPlan {
  return {
    id: 1,
    code: 'plus',
    name: 'Plus',
    priceAmountEur: '4.99',
    priceAmountXaf: '3000',
    billingPeriod: 'monthly',
    maxActiveVoyages: null,
    maxActiveDemandes: null,
    hasBadge: true,
    isFeatured: false,
    isActive: true,
    sortOrder: 1,
    stripePriceId: null,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('SubscriptionPlanFormModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un formulaire vide en mode creation', () => {
    render(<SubscriptionPlanFormModal plan={null} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText('Nouveau plan d\'abonnement')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('plus')).not.toBeDisabled();
  });

  it('pre-remplit le formulaire et desactive le code en mode edition', () => {
    render(<SubscriptionPlanFormModal plan={makePlan()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText('Modifier le plan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('plus')).toBeDisabled();
    expect(screen.getByDisplayValue('Plus')).toBeInTheDocument();
  });

  it('rejette un code contenant des majuscules a la creation', async () => {
    const user = userEvent.setup();
    render(<SubscriptionPlanFormModal plan={null} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('plus'), 'Plus');
    await user.type(screen.getByPlaceholderText('Plus'), 'Plus');
    await user.click(screen.getByRole('button', { name: /créer le plan/i }));

    expect(await screen.findByText(/minuscules, chiffres, tirets/i)).toBeInTheDocument();
    expect(mockCreateSubscriptionPlan).not.toHaveBeenCalled();
  });

  it('cree un plan avec un code valide', async () => {
    mockCreateSubscriptionPlan.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<SubscriptionPlanFormModal plan={null} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText('plus'), 'starter');
    await user.type(screen.getByPlaceholderText('Plus'), 'Starter');
    await user.click(screen.getByRole('button', { name: /créer le plan/i }));

    await waitFor(() => expect(mockCreateSubscriptionPlan).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'starter', name: 'Starter' })
    ));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('met a jour un plan existant sans jamais permettre de changer le code affiche', async () => {
    mockUpdateSubscriptionPlan.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<SubscriptionPlanFormModal plan={makePlan()} onClose={vi.fn()} onSuccess={onSuccess} />);

    const nameInput = screen.getByDisplayValue('Plus');
    await user.clear(nameInput);
    await user.type(nameInput, 'Plus Renomme');
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => expect(mockUpdateSubscriptionPlan).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: 'Plus Renomme' })
    ));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
