import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminDashboardData } from '@/types';

import AdminDashboardPageClient from '../dashboard-client';

const mockFetchDashboard = vi.fn();
const mockUseAdmin = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => mockUseAdmin(),
}));

function makeDashboardData(): AdminDashboardData {
  return {
    users: { total: 10, actifs: 8, bannis: 1, nouveauxCeMois: 2, nouveauxAujourdhui: 0, emailVerifies: 5, telephoneVerifies: 3, admins: 1, moderators: 0, tauxVerificationEmail: 0.5, tauxVerificationTelephone: 0.3 },
    voyages: { total: 5, actifs: 2, complets: 2, termines: 1, annules: 0, nouveauxCeMois: 1, nouveauxAujourdhui: 0, tauxReussite: 0.8 },
    demandes: { total: 4, enRecherche: 2, voyageurTrouve: 1, annulees: 1, nouvellesCeMois: 1, nouvellesAujourdhui: 0, tauxReussite: 0.6 },
    signalements: { total: 1, enAttente: 1, traites: 0, rejetes: 0, nouveauxCeMois: 1, tauxTraitement: 0 },
    activity: { derniers7Jours: [], tendance: { direction: 'stable', percentage: 0 } },
    engagement: { totalAvis: 3, totalMessages: 20, totalConversations: 6, moyenneAvisParUtilisateur: 1.2, utilisateursAvecAvis: 2 },
  };
}

describe('admin/dashboard-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un etat de chargement tant qu aucune donnee n est disponible', () => {
    mockUseAdmin.mockReturnValue({ dashboardData: null, isLoading: true, error: null, fetchDashboard: mockFetchDashboard });
    render(<AdminDashboardPageClient />);
    expect(screen.getByText(/chargement du dashboard admin/i)).toBeInTheDocument();
  });

  it("affiche le message d'erreur si le chargement echoue", () => {
    mockUseAdmin.mockReturnValue({ dashboardData: null, isLoading: false, error: 'Erreur reseau', fetchDashboard: mockFetchDashboard });
    render(<AdminDashboardPageClient />);
    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
  });

  it('affiche les statistiques une fois les donnees chargees', () => {
    mockUseAdmin.mockReturnValue({ dashboardData: makeDashboardData(), isLoading: false, error: null, fetchDashboard: mockFetchDashboard });
    render(<AdminDashboardPageClient />);
    expect(screen.getByRole('heading', { name: /dashboard administration/i })).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('declenche fetchDashboard au montage', () => {
    mockUseAdmin.mockReturnValue({ dashboardData: null, isLoading: true, error: null, fetchDashboard: mockFetchDashboard });
    render(<AdminDashboardPageClient />);
    expect(mockFetchDashboard).toHaveBeenCalledTimes(1);
  });
});
