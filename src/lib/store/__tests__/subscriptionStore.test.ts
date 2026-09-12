import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiError, MySubscriptionResponse, SubscriptionPlan } from '@/types';

vi.mock('@/lib/api/subscriptions', () => ({
  subscriptionsApi: {
    getPlans: vi.fn(),
    getMine: vi.fn(),
    checkout: vi.fn(),
    cancel: vi.fn(),
  },
}));

import { subscriptionsApi } from '@/lib/api/subscriptions';

import { useSubscriptionStore } from '../subscriptionStore';

const initialState = useSubscriptionStore.getState();
const mockPlans = [{ id: 1, code: 'free' }] as SubscriptionPlan[];
const mockMySubscription = { plan: { id: 1, code: 'free' } } as MySubscriptionResponse;

beforeEach(() => {
  useSubscriptionStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('subscriptionStore.fetchPlans', () => {
  it('charge les plans en cas de succes', async () => {
    vi.mocked(subscriptionsApi.getPlans).mockResolvedValue(mockPlans);

    await useSubscriptionStore.getState().fetchPlans();

    expect(useSubscriptionStore.getState()).toMatchObject({ plans: mockPlans, isLoadingPlans: false });
  });

  it('ne refait pas d\'appel si des plans sont deja charges', async () => {
    useSubscriptionStore.setState({ plans: mockPlans });

    await useSubscriptionStore.getState().fetchPlans();

    expect(subscriptionsApi.getPlans).not.toHaveBeenCalled();
  });

  it('n\'est pas bloque par le chargement en cours de fetchMySubscription (flags de chargement independants)', async () => {
    // Regression : useSubscription() et useSubscriptionPlans() sont montes ensemble sur
    // la page d'abonnement et declenchent chacun leur fetch au montage. Si les deux
    // partageaient le meme flag isLoading, le set({isLoading:true}) synchrone de
    // fetchMySubscription (toujours appele en premier) ferait echouer la garde anti-
    // doublon de fetchPlans avant meme que l'appel API ne parte - le catalogue ne
    // s'afficherait alors jamais.
    vi.mocked(subscriptionsApi.getMine).mockResolvedValue(mockMySubscription);
    vi.mocked(subscriptionsApi.getPlans).mockResolvedValue(mockPlans);

    const mySubscriptionPromise = useSubscriptionStore.getState().fetchMySubscription();
    const plansPromise = useSubscriptionStore.getState().fetchPlans();
    await Promise.all([mySubscriptionPromise, plansPromise]);

    expect(subscriptionsApi.getPlans).toHaveBeenCalledTimes(1);
    expect(useSubscriptionStore.getState().plans).toEqual(mockPlans);
  });
});

describe('subscriptionStore.fetchMySubscription', () => {
  it('charge l\'abonnement en cas de succes', async () => {
    vi.mocked(subscriptionsApi.getMine).mockResolvedValue(mockMySubscription);

    await useSubscriptionStore.getState().fetchMySubscription();

    expect(useSubscriptionStore.getState()).toMatchObject({ mySubscription: mockMySubscription, isLoading: false });
  });

  it('ne refait pas d\'appel si un abonnement est deja charge (garde-fou)', async () => {
    useSubscriptionStore.setState({ mySubscription: mockMySubscription });

    await useSubscriptionStore.getState().fetchMySubscription();

    expect(subscriptionsApi.getMine).not.toHaveBeenCalled();
  });
});

describe('subscriptionStore.refreshMySubscription', () => {
  it('recharge meme si un abonnement est deja present (contrairement a fetchMySubscription)', async () => {
    useSubscriptionStore.setState({ mySubscription: mockMySubscription });
    const updated = { plan: { id: 2, code: 'plus' } } as MySubscriptionResponse;
    vi.mocked(subscriptionsApi.getMine).mockResolvedValue(updated);

    await useSubscriptionStore.getState().refreshMySubscription();

    expect(subscriptionsApi.getMine).toHaveBeenCalledTimes(1);
    expect(useSubscriptionStore.getState().mySubscription).toBe(updated);
  });
});

describe('subscriptionStore.checkout', () => {
  it('retourne l\'url de checkout en cas de succes', async () => {
    vi.mocked(subscriptionsApi.checkout).mockResolvedValue({ checkoutUrl: 'https://checkout.stripe.com/x' });

    const url = await useSubscriptionStore.getState().checkout({
      planCode: 'plus',
      accessImmediateConsent: true,
      withdrawalWaiverConsent: true,
    });

    expect(url).toBe('https://checkout.stripe.com/x');
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Plan introuvable' };
    vi.mocked(subscriptionsApi.checkout).mockRejectedValue(apiError);

    await expect(
      useSubscriptionStore.getState().checkout({
        planCode: 'inexistant',
        accessImmediateConsent: true,
        withdrawalWaiverConsent: true,
      })
    ).rejects.toBe(apiError);

    expect(useSubscriptionStore.getState()).toMatchObject({ isLoading: false, error: 'Plan introuvable' });
  });
});

describe('subscriptionStore.cancelSubscription', () => {
  it('recharge l\'abonnement apres resiliation (le webhook reste la source de verite)', async () => {
    vi.mocked(subscriptionsApi.cancel).mockResolvedValue(undefined);
    const afterCancel = { plan: { id: 1, code: 'free' }, subscription: null } as MySubscriptionResponse;
    vi.mocked(subscriptionsApi.getMine).mockResolvedValue(afterCancel);

    await useSubscriptionStore.getState().cancelSubscription();

    expect(subscriptionsApi.getMine).toHaveBeenCalledTimes(1);
    expect(useSubscriptionStore.getState().mySubscription).toBe(afterCancel);
  });
});
