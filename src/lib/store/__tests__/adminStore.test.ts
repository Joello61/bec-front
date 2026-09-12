import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminBoostOffer, AdminSubscriptionPlan, AdminTransaction, ApiError, User } from '@/types';

vi.mock('@/lib/api/admin', () => ({
  adminApi: {
    getDashboard: vi.fn(),
    banUser: vi.fn(),
    deleteUser: vi.fn(),
    getSubscriptionPlans: vi.fn(),
    createSubscriptionPlan: vi.fn(),
    updateSubscriptionPlan: vi.fn(),
    deleteSubscriptionPlan: vi.fn(),
    getBoostOffers: vi.fn(),
    createBoostOffer: vi.fn(),
    updateBoostOffer: vi.fn(),
    deleteBoostOffer: vi.fn(),
    getRevenueStats: vi.fn(),
    getTransactions: vi.fn(),
    refundTransaction: vi.fn(),
  },
}));

import { adminApi } from '@/lib/api/admin';

import { useAdminStore } from '../adminStore';

const initialState = useAdminStore.getState();

const mockUser = { id: 1 } as User;
const mockPagination = { page: 1, limit: 20, total: 1, pages: 1 };

beforeEach(() => {
  useAdminStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('adminStore (representatif des 25 actions, toutes generees par le meme pattern)', () => {
  it('fetchDashboard : charge les donnees en cas de succes', async () => {
    vi.mocked(adminApi.getDashboard).mockResolvedValue({} as never);

    await useAdminStore.getState().fetchDashboard();

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: null });
  });

  it('fetchDashboard : absorbe l\'erreur sans relancer (forme fetch)', async () => {
    vi.mocked(adminApi.getDashboard).mockRejectedValue({ success: false, message: 'Erreur serveur' } as ApiError);

    await expect(useAdminStore.getState().fetchDashboard()).resolves.toBeUndefined();

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur serveur' });
  });

  it('banUser : relance l\'erreur en cas d\'echec (forme mutation)', async () => {
    const apiError: ApiError = { success: false, message: 'Utilisateur introuvable' };
    vi.mocked(adminApi.banUser).mockRejectedValue(apiError);

    await expect(
      useAdminStore.getState().banUser(1, { reason: 'spam', type: 'permanent' })
    ).rejects.toBe(apiError);

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: 'Utilisateur introuvable' });
  });

  it('deleteUser : retire l\'utilisateur de la liste en cas de succes (etat de succes personnalise)', async () => {
    useAdminStore.setState({ users: [mockUser, { id: 2 } as User] });
    vi.mocked(adminApi.deleteUser).mockResolvedValue(undefined);

    await useAdminStore.getState().deleteUser(1, 'RGPD');

    expect(useAdminStore.getState().users).toEqual([{ id: 2 }]);
  });
});

describe('adminStore - catalogue (Lot 5)', () => {
  const mockPlan = { id: 1, code: 'plus' } as AdminSubscriptionPlan;
  const mockOffer = { id: 1, name: '7 jours' } as AdminBoostOffer;

  it('fetchSubscriptionPlans : charge les plans en cas de succes', async () => {
    vi.mocked(adminApi.getSubscriptionPlans).mockResolvedValue([mockPlan]);

    await useAdminStore.getState().fetchSubscriptionPlans();

    expect(useAdminStore.getState().subscriptionPlans).toEqual([mockPlan]);
  });

  it('createSubscriptionPlan : ajoute le plan cree a la liste', async () => {
    vi.mocked(adminApi.createSubscriptionPlan).mockResolvedValue(mockPlan);

    await useAdminStore.getState().createSubscriptionPlan({
      code: 'plus',
      name: 'Plus',
      priceAmountEur: '4.99',
      priceAmountXaf: null,
      billingPeriod: 'monthly',
      maxActiveVoyages: null,
      maxActiveDemandes: null,
      hasBadge: false,
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
      stripePriceId: null,
    });

    expect(useAdminStore.getState().subscriptionPlans).toContainEqual(mockPlan);
  });

  it('createSubscriptionPlan : relance l\'erreur en cas d\'echec (code deja pris)', async () => {
    const apiError: ApiError = { success: false, message: 'Un plan avec le code "plus" existe déjà' };
    vi.mocked(adminApi.createSubscriptionPlan).mockRejectedValue(apiError);

    await expect(
      useAdminStore.getState().createSubscriptionPlan({
        code: 'plus',
        name: 'Plus',
        priceAmountEur: null,
        priceAmountXaf: null,
        billingPeriod: 'monthly',
        maxActiveVoyages: null,
        maxActiveDemandes: null,
        hasBadge: false,
        isFeatured: false,
        isActive: true,
        sortOrder: 0,
        stripePriceId: null,
      })
    ).rejects.toBe(apiError);
  });

  it('updateSubscriptionPlan : remplace le plan mis a jour dans la liste', async () => {
    const updated = { id: 1, code: 'plus', name: 'Plus (renomme)' } as AdminSubscriptionPlan;
    useAdminStore.setState({ subscriptionPlans: [mockPlan] });
    vi.mocked(adminApi.updateSubscriptionPlan).mockResolvedValue(updated);

    await useAdminStore.getState().updateSubscriptionPlan(1, {
      name: 'Plus (renomme)',
      priceAmountEur: '4.99',
      priceAmountXaf: null,
      billingPeriod: 'monthly',
      maxActiveVoyages: null,
      maxActiveDemandes: null,
      hasBadge: false,
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
      stripePriceId: null,
    });

    expect(useAdminStore.getState().subscriptionPlans).toEqual([updated]);
  });

  it('deleteSubscriptionPlan : retire le plan de la liste en cas de succes', async () => {
    useAdminStore.setState({ subscriptionPlans: [mockPlan, { id: 2, code: 'pro' } as AdminSubscriptionPlan] });
    vi.mocked(adminApi.deleteSubscriptionPlan).mockResolvedValue(undefined);

    await useAdminStore.getState().deleteSubscriptionPlan(1);

    expect(useAdminStore.getState().subscriptionPlans).toEqual([{ id: 2, code: 'pro' }]);
  });

  it('deleteSubscriptionPlan : relance l\'erreur en cas d\'echec (plan gratuit)', async () => {
    const apiError: ApiError = { success: false, message: 'Le plan gratuit ne peut pas être supprimé' };
    vi.mocked(adminApi.deleteSubscriptionPlan).mockRejectedValue(apiError);

    await expect(useAdminStore.getState().deleteSubscriptionPlan(1)).rejects.toBe(apiError);
  });

  it('fetchBoostOffers : charge les offres en cas de succes', async () => {
    vi.mocked(adminApi.getBoostOffers).mockResolvedValue([mockOffer]);

    await useAdminStore.getState().fetchBoostOffers();

    expect(useAdminStore.getState().boostOffers).toEqual([mockOffer]);
  });

  it('deleteBoostOffer : retire l\'offre de la liste en cas de succes', async () => {
    useAdminStore.setState({ boostOffers: [mockOffer, { id: 2, name: '15 jours' } as AdminBoostOffer] });
    vi.mocked(adminApi.deleteBoostOffer).mockResolvedValue(undefined);

    await useAdminStore.getState().deleteBoostOffer(1);

    expect(useAdminStore.getState().boostOffers).toEqual([{ id: 2, name: '15 jours' }]);
  });

  it('fetchRevenueStats : charge les stats en cas de succes', async () => {
    const stats = { totalByCurrency: { EUR: '100.00' } } as never;
    vi.mocked(adminApi.getRevenueStats).mockResolvedValue(stats);

    await useAdminStore.getState().fetchRevenueStats(7);

    expect(adminApi.getRevenueStats).toHaveBeenCalledWith(7);
    expect(useAdminStore.getState().revenueStats).toEqual(stats);
  });
});

describe('adminStore - transactions (Lot 6.1)', () => {
  const mockTransaction = { id: 1, status: 'succeeded' } as AdminTransaction;

  it('fetchTransactions : charge la page et la pagination en cas de succes', async () => {
    vi.mocked(adminApi.getTransactions).mockResolvedValue({ data: [mockTransaction], pagination: mockPagination });

    await useAdminStore.getState().fetchTransactions(1, 20, { status: 'succeeded' });

    expect(adminApi.getTransactions).toHaveBeenCalledWith(1, 20, { status: 'succeeded' });
    expect(useAdminStore.getState().transactions).toEqual([mockTransaction]);
    expect(useAdminStore.getState().transactionsPagination).toEqual(mockPagination);
  });

  it('refundTransaction : remplace la transaction remboursee dans la liste', async () => {
    const refunded = { id: 1, status: 'refunded' } as AdminTransaction;
    useAdminStore.setState({ transactions: [mockTransaction, { id: 2, status: 'succeeded' } as AdminTransaction] });
    vi.mocked(adminApi.refundTransaction).mockResolvedValue(refunded);

    await useAdminStore.getState().refundTransaction(1, { reason: 'Erreur de facturation' });

    expect(useAdminStore.getState().transactions).toEqual([refunded, { id: 2, status: 'succeeded' }]);
  });

  it('refundTransaction : relance l\'erreur en cas d\'echec (forme mutation)', async () => {
    const apiError: ApiError = { success: false, message: 'Transaction introuvable' };
    vi.mocked(adminApi.refundTransaction).mockRejectedValue(apiError);

    await expect(useAdminStore.getState().refundTransaction(1, {})).rejects.toBe(apiError);

    expect(useAdminStore.getState()).toMatchObject({ isLoading: false, error: 'Transaction introuvable' });
  });
});
