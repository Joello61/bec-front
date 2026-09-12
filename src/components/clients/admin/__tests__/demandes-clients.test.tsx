import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Demande, PaginationMeta, User } from '@/types';

import AdminModerationDemandesPageClient from '../demandes-clients';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockUseAdmin = vi.fn();
const mockFetchDemandesList = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: (...args: unknown[]) => mockUseAdmin(...args),
}));

function makeClient(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'client@example.com', nom: 'Doe', prenom: 'Jane', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeDemande(overrides: Partial<Demande> = {}): Demande {
  return {
    id: 20, client: makeClient(), villeDepart: 'Douala', villeArrivee: 'Paris',
    dateLimite: '2026-01-15T00:00:00.000Z', poidsEstime: '5', prixParKilo: '1500',
    commissionProposeePourUnBagage: null, currency: 'XAF', description: 'Colis fragile',
    statut: 'en_recherche', isCurrentlyBoosted: false, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('clients/admin/demandes-clients - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdmin.mockReturnValue({
      demandesList: [makeDemande()],
      demandesListPagination: { page: 1, pages: 1, total: 1, limit: 10 } as PaginationMeta,
      isLoading: false,
      error: null,
      fetchDemandesList: mockFetchDemandesList,
      deleteVoyage: vi.fn(),
      deleteDemande: vi.fn(),
      deleteAvis: vi.fn(),
      deleteMessage: vi.fn(),
    });
  });

  it('affiche une erreur si le chargement echoue', () => {
    mockUseAdmin.mockReturnValue({
      demandesList: [], demandesListPagination: null, isLoading: false, error: 'Erreur reseau',
      fetchDemandesList: mockFetchDemandesList, deleteDemande: vi.fn(),
    });
    render(<AdminModerationDemandesPageClient />);
    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
  });

  it('reinterroge avec le statut selectionne et reinitialise la page', async () => {
    const user = userEvent.setup();
    render(<AdminModerationDemandesPageClient />);

    const selectTrigger = screen.getByText(/tous les statuts/i);
    await user.click(selectTrigger);
    await user.click(await screen.findByRole('button', { name: /voyageur trouvé/i }));

    await waitFor(() => expect(mockFetchDemandesList).toHaveBeenLastCalledWith(1, 10, { search: undefined, statut: 'voyageur_trouve' }));
  });

  it('ouvre la modale de suppression', async () => {
    const user = userEvent.setup();
    render(<AdminModerationDemandesPageClient />);

    await user.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(screen.getByText(/supprimer la demande/i)).toBeInTheDocument();
  });

  /**
   * Bug de production corrige (Phase 13/Lot F1, plan-correction-cobage.md) : le champ
   * de recherche n'etait jusqu'ici jamais transmis au filtre reel - champ visuellement
   * present mais totalement inerte.
   */
  it('transmet le terme de recherche au filtre apres le debounce', async () => {
    const user = userEvent.setup();
    render(<AdminModerationDemandesPageClient />);

    await user.type(screen.getByPlaceholderText(/rechercher une demande/i), 'Martin');

    await waitFor(() => expect(mockFetchDemandesList).toHaveBeenLastCalledWith(1, 10, { search: 'Martin', statut: undefined }), { timeout: 1000 });
  });
});
