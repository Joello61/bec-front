import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, BoostOffer } from '@/types';

vi.mock('@/lib/api/boosts', () => ({
  boostsApi: {
    getOffers: vi.fn(),
    checkout: vi.fn(),
  },
}));

import { boostsApi } from '@/lib/api/boosts';

import { useBoostStore } from '../boostStore';

const initialState = useBoostStore.getState();
const mockOffers: BoostOffer[] = [
  { id: 1, name: '7 jours', durationDays: 7, priceAmountEur: '2.99', priceAmountXaf: null, isFeatured: false, isActive: true, sortOrder: 0 },
];

beforeEach(() => {
  useBoostStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('boostStore.fetchOffers', () => {
  it('charge les offres en cas de succes', async () => {
    vi.mocked(boostsApi.getOffers).mockResolvedValue(mockOffers);

    await useBoostStore.getState().fetchOffers();

    expect(useBoostStore.getState()).toMatchObject({ offers: mockOffers, isLoading: false });
  });

  it('ne refait pas d\'appel si des offres sont deja chargees', async () => {
    useBoostStore.setState({ offers: mockOffers });

    await useBoostStore.getState().fetchOffers();

    expect(boostsApi.getOffers).not.toHaveBeenCalled();
  });
});

describe('boostStore.checkout', () => {
  it('retourne l\'url de checkout en cas de succes', async () => {
    vi.mocked(boostsApi.checkout).mockResolvedValue({ checkoutUrl: 'https://checkout.stripe.com/boost' });

    const url = await useBoostStore.getState().checkout({
      targetType: 'voyage',
      targetId: 10,
      offerId: 1,
      paymentMethod: 'card',
      accessImmediateConsent: true,
      withdrawalWaiverConsent: true,
    });

    expect(url).toBe('https://checkout.stripe.com/boost');
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Offre introuvable' };
    vi.mocked(boostsApi.checkout).mockRejectedValue(apiError);

    await expect(
      useBoostStore.getState().checkout({
        targetType: 'voyage',
        targetId: 10,
        offerId: 99,
        paymentMethod: 'card',
        accessImmediateConsent: true,
        withdrawalWaiverConsent: true,
      })
    ).rejects.toBe(apiError);

    expect(useBoostStore.getState()).toMatchObject({ isLoading: false, error: 'Offre introuvable' });
  });
});
