import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminBoostOffer } from '@/types';

import BoostOfferFormModal from '../BoostOfferFormModal';

const mockCreateBoostOffer = vi.fn();
const mockUpdateBoostOffer = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({
    createBoostOffer: mockCreateBoostOffer,
    updateBoostOffer: mockUpdateBoostOffer,
  }),
}));

function makeOffer(overrides: Partial<AdminBoostOffer> = {}): AdminBoostOffer {
  return {
    id: 1,
    name: '7 jours',
    durationDays: 7,
    priceAmountEur: '2.99',
    priceAmountXaf: '2000',
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('BoostOfferFormModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un formulaire avec des valeurs par defaut en mode creation', () => {
    render(<BoostOfferFormModal offer={null} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText('Nouvelle offre de boost')).toBeInTheDocument();
  });

  it('pre-remplit le formulaire en mode edition', () => {
    render(<BoostOfferFormModal offer={makeOffer()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText('Modifier l\'offre')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7 jours')).toBeInTheDocument();
  });

  it('rejette une duree negative', async () => {
    const user = userEvent.setup();
    render(<BoostOfferFormModal offer={null} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('7 jours'), '15 jours');
    const durationInput = screen.getByLabelText(/durée/i);
    await user.clear(durationInput);
    await user.type(durationInput, '-5');
    await user.type(screen.getByPlaceholderText('2.99'), '4.99');
    await user.click(screen.getByRole('button', { name: /créer l'offre/i }));

    expect(await screen.findByText(/durée doit être positive/i)).toBeInTheDocument();
    expect(mockCreateBoostOffer).not.toHaveBeenCalled();
  });

  it('cree une offre avec des donnees valides', async () => {
    mockCreateBoostOffer.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<BoostOfferFormModal offer={null} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText('7 jours'), '15 jours');
    const durationInput = screen.getByLabelText(/durée/i);
    await user.clear(durationInput);
    await user.type(durationInput, '15');
    await user.type(screen.getByPlaceholderText('2.99'), '4.99');
    await user.click(screen.getByRole('button', { name: /créer l'offre/i }));

    await waitFor(() => expect(mockCreateBoostOffer).toHaveBeenCalledWith(
      expect.objectContaining({ name: '15 jours', durationDays: 15, priceAmountEur: '4.99' })
    ));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('met a jour une offre existante', async () => {
    mockUpdateBoostOffer.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<BoostOfferFormModal offer={makeOffer()} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => expect(mockUpdateBoostOffer).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: '7 jours', durationDays: 7 })
    ));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
