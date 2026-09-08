import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminUsersDetailedStats, AdminVoyagesStats } from '@/types';

import AdminStatsPageClient from '../stats-client';

const mockFetchUsersStats = vi.fn();
const mockFetchVoyagesStats = vi.fn();
const mockFetchDemandesStats = vi.fn();
const mockFetchSignalementsStats = vi.fn();
const mockUseAdmin = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => mockUseAdmin(),
}));

function makeUsersStats(): AdminUsersDetailedStats {
  return {
    global: {
      total: 42, actifs: 40, bannis: 2, nouveauxCeMois: 5, nouveauxAujourdhui: 0,
      emailVerifies: 30, telephoneVerifies: 20, admins: 2, moderators: 1,
      tauxVerificationEmail: 71.4, tauxVerificationTelephone: 47.6,
    },
    detailed: [],
    authProviders: {
      local: { count: 30, percentage: 71.4 },
      google: { count: 10, percentage: 23.8 },
      facebook: { count: 2, percentage: 4.8 },
    },
  };
}

function makeVoyagesStats(): AdminVoyagesStats {
  return {
    total: 15, actifs: 5, complets: 8, termines: 8, annules: 2,
    nouveauxCeMois: 3, nouveauxAujourdhui: 0, tauxReussite: 80,
  };
}

describe('clients/admin/stats-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdmin.mockReturnValue({
      usersStats: makeUsersStats(),
      voyagesStats: null,
      demandesStats: null,
      signalementsStats: null,
      isLoading: false,
      error: null,
      fetchUsersStats: mockFetchUsersStats,
      fetchVoyagesStats: mockFetchVoyagesStats,
      fetchDemandesStats: mockFetchDemandesStats,
      fetchSignalementsStats: mockFetchSignalementsStats,
    });
  });

  it("ne recharge pas les stats deja disponibles pour l'onglet actif", () => {
    render(<AdminStatsPageClient />);
    expect(mockFetchUsersStats).not.toHaveBeenCalled();
  });

  it('charge les stats utilisateurs au montage quand elles ne sont pas encore disponibles', () => {
    mockUseAdmin.mockReturnValue({
      usersStats: null, voyagesStats: null, demandesStats: null, signalementsStats: null,
      isLoading: false, error: null,
      fetchUsersStats: mockFetchUsersStats, fetchVoyagesStats: mockFetchVoyagesStats,
      fetchDemandesStats: mockFetchDemandesStats, fetchSignalementsStats: mockFetchSignalementsStats,
    });
    render(<AdminStatsPageClient />);
    expect(mockFetchUsersStats).toHaveBeenCalledTimes(1);
  });

  it('charge les stats voyages uniquement au changement d onglet, pas au montage', async () => {
    const user = userEvent.setup();
    render(<AdminStatsPageClient />);
    expect(mockFetchVoyagesStats).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /voyages/i }));
    expect(mockFetchVoyagesStats).toHaveBeenCalledTimes(1);
  });

  it('affiche les statistiques utilisateurs par defaut', () => {
    render(<AdminStatsPageClient />);
    expect(screen.getByText('Statistiques Utilisateurs')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('bascule vers les statistiques voyages une fois chargees', () => {
    mockUseAdmin.mockReturnValue({
      usersStats: makeUsersStats(), voyagesStats: makeVoyagesStats(), demandesStats: null, signalementsStats: null,
      isLoading: false, error: null,
      fetchUsersStats: mockFetchUsersStats, fetchVoyagesStats: mockFetchVoyagesStats,
      fetchDemandesStats: mockFetchDemandesStats, fetchSignalementsStats: mockFetchSignalementsStats,
    });
    render(<AdminStatsPageClient />);
    expect(screen.queryByText('Statistiques Voyages')).not.toBeInTheDocument();
  });

  it("affiche l'erreur au lieu du contenu si une des requetes echoue", () => {
    mockUseAdmin.mockReturnValue({
      usersStats: null, voyagesStats: null, demandesStats: null, signalementsStats: null,
      isLoading: false, error: 'Erreur reseau',
      fetchUsersStats: mockFetchUsersStats, fetchVoyagesStats: mockFetchVoyagesStats,
      fetchDemandesStats: mockFetchDemandesStats, fetchSignalementsStats: mockFetchSignalementsStats,
    });
    render(<AdminStatsPageClient />);
    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
  });
});
