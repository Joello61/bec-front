import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Favori, User } from '@/types';

import FavorisPageClient from '../favoris-client';

const mockUseFavorisVoyages = vi.fn();
const mockUseFavorisDemandes = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useFavorisVoyages: () => mockUseFavorisVoyages(),
  useFavorisDemandes: () => mockUseFavorisDemandes(),
}));

vi.mock('@/components/favori', () => ({
  FavoritesList: ({ favorisVoyages, favorisDemandes }: { favorisVoyages: Favori[]; favorisDemandes: Favori[] }) => (
    <div>{`FavoritesList: ${favorisVoyages.length} voyages, ${favorisDemandes.length} demandes`}</div>
  ),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeFavori(overrides: Partial<Favori> = {}): Favori {
  return { id: 1, user: makeUser(), voyage: null, demande: null, createdAt: '2026-01-01T00:00:00.000Z', ...overrides };
}

describe('favoris-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le chargement tant qu un seul des deux flux est en cours (voyages)', () => {
    mockUseFavorisVoyages.mockReturnValue({ favorisVoyages: [], isLoading: true });
    mockUseFavorisDemandes.mockReturnValue({ favorisDemandes: [], isLoading: false });
    render(<FavorisPageClient />);
    expect(screen.getByText(/chargement de vos favoris/i)).toBeInTheDocument();
  });

  it('affiche le chargement tant qu un seul des deux flux est en cours (demandes)', () => {
    mockUseFavorisVoyages.mockReturnValue({ favorisVoyages: [], isLoading: false });
    mockUseFavorisDemandes.mockReturnValue({ favorisDemandes: [], isLoading: true });
    render(<FavorisPageClient />);
    expect(screen.getByText(/chargement de vos favoris/i)).toBeInTheDocument();
  });

  it("affiche l'etat vide seulement quand les deux listes sont vides", () => {
    mockUseFavorisVoyages.mockReturnValue({ favorisVoyages: [], isLoading: false });
    mockUseFavorisDemandes.mockReturnValue({ favorisDemandes: [], isLoading: false });
    render(<FavorisPageClient />);
    expect(screen.getByText(/aucun favori/i)).toBeInTheDocument();
  });

  it('affiche la liste des qu au moins une categorie contient un favori', () => {
    mockUseFavorisVoyages.mockReturnValue({ favorisVoyages: [makeFavori()], isLoading: false });
    mockUseFavorisDemandes.mockReturnValue({ favorisDemandes: [], isLoading: false });
    render(<FavorisPageClient />);
    expect(screen.getByText('FavoritesList: 1 voyages, 0 demandes')).toBeInTheDocument();
  });
});
