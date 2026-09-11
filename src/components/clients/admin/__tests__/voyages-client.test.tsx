import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PaginationMeta, User, Voyage } from '@/types';

import AdminModerationVoyagesPageClient from '../voyages-client';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockUseAdmin = vi.fn();
const mockFetchVoyagesList = vi.fn();
const mockDeleteVoyage = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: (...args: unknown[]) => mockUseAdmin(...args),
}));

function makeVoyageur(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'voyageur@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeVoyage(overrides: Partial<Voyage> = {}): Voyage {
  return {
    id: 10, voyageur: makeVoyageur(), villeDepart: 'Yaoundé', villeArrivee: 'Douala',
    dateDepart: '2026-01-10T00:00:00.000Z', dateArrivee: '2026-01-11T00:00:00.000Z',
    poidsDisponible: '20', poidsDisponibleRestant: '20', prixParKilo: '1000',
    commissionProposeePourUnBagage: null, currency: 'XAF', description: null,
    statut: 'actif', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('clients/admin/voyages-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdmin.mockReturnValue({
      voyagesList: [makeVoyage()],
      voyagesListPagination: { page: 1, pages: 1, total: 1, limit: 10 } as PaginationMeta,
      isLoading: false,
      error: null,
      fetchVoyagesList: mockFetchVoyagesList,
      deleteVoyage: mockDeleteVoyage,
      deleteDemande: vi.fn(),
      deleteAvis: vi.fn(),
      deleteMessage: vi.fn(),
    });
  });

  it('affiche une erreur si le chargement echoue', () => {
    mockUseAdmin.mockReturnValue({
      voyagesList: [], voyagesListPagination: null, isLoading: false, error: 'Erreur reseau',
      fetchVoyagesList: mockFetchVoyagesList, deleteVoyage: mockDeleteVoyage,
    });
    render(<AdminModerationVoyagesPageClient />);
    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
  });

  it('reinterroge avec le statut selectionne et reinitialise la page', async () => {
    const user = userEvent.setup();
    render(<AdminModerationVoyagesPageClient />);

    // Selectionne le statut via le composant Select (ouverture + choix de l'option).
    const selectTrigger = screen.getByText(/tous les statuts/i);
    await user.click(selectTrigger);
    await user.click(await screen.findByRole('button', { name: 'Actif' }));

    await waitFor(() => expect(mockFetchVoyagesList).toHaveBeenLastCalledWith(1, 10, { search: undefined, statut: 'actif' }));
  });

  it('ouvre la modale de suppression et rafraichit la liste apres succes', async () => {
    const user = userEvent.setup();
    render(<AdminModerationVoyagesPageClient />);

    await user.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(screen.getByText(/action irréversible|supprimer le voyage/i)).toBeInTheDocument();
  });

  it('reinitialise le filtre de statut au clic sur Reinitialiser', async () => {
    const user = userEvent.setup();
    render(<AdminModerationVoyagesPageClient />);

    const selectTrigger = screen.getByText(/tous les statuts/i);
    await user.click(selectTrigger);
    await user.click(await screen.findByRole('button', { name: 'Actif' }));

    await user.click(screen.getByRole('button', { name: /réinitialiser/i }));
    await waitFor(() => expect(mockFetchVoyagesList).toHaveBeenLastCalledWith(1, 10, undefined));
  });

  /**
   * Bug de production corrige (Phase 13/Lot F1, plan-correction-cobage.md) : le champ
   * de recherche n'etait jusqu'ici jamais transmis au filtre reel - champ visuellement
   * present mais totalement inerte.
   */
  it('transmet le terme de recherche au filtre apres le debounce', async () => {
    const user = userEvent.setup();
    render(<AdminModerationVoyagesPageClient />);

    await user.type(screen.getByPlaceholderText(/rechercher un voyage/i), 'Dupont');

    await waitFor(() => expect(mockFetchVoyagesList).toHaveBeenLastCalledWith(1, 10, { search: 'Dupont', statut: undefined }), { timeout: 1000 });
  });
});
