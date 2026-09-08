import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminModerationDemandesPageClient from '../demandes-clients';
import type { Demande, User, PaginationMeta } from '@/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockUseDemandes = vi.fn();
const mockRefetch = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useDemandes: (...args: unknown[]) => mockUseDemandes(...args),
  useAdmin: () => ({
    deleteVoyage: vi.fn(),
    deleteDemande: vi.fn(),
    deleteAvis: vi.fn(),
    deleteMessage: vi.fn(),
  }),
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
    statut: 'en_recherche', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('clients/admin/demandes-clients - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDemandes.mockReturnValue({
      demandes: [makeDemande()],
      pagination: { page: 1, pages: 1, total: 1, limit: 10 } as PaginationMeta,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('affiche une erreur si le chargement echoue', () => {
    mockUseDemandes.mockReturnValue({ demandes: [], pagination: null, isLoading: false, error: 'Erreur reseau', refetch: mockRefetch });
    render(<AdminModerationDemandesPageClient />);
    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
  });

  it('reinterroge avec le statut selectionne et reinitialise la page', async () => {
    const user = userEvent.setup();
    render(<AdminModerationDemandesPageClient />);

    const selectTrigger = screen.getByText(/tous les statuts/i);
    await user.click(selectTrigger);
    await user.click(await screen.findByRole('button', { name: /voyageur trouvé/i }));

    await waitFor(() => expect(mockUseDemandes).toHaveBeenLastCalledWith(1, 10, { statut: 'voyageur_trouve' }));
  });

  it('ouvre la modale de suppression', async () => {
    const user = userEvent.setup();
    render(<AdminModerationDemandesPageClient />);

    await user.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(screen.getByText(/supprimer la demande/i)).toBeInTheDocument();
  });
});
