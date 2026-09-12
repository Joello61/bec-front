import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Demande, Favori, User, Voyage } from '@/types';

import FavoritesList from '../FavoritesList';

vi.mock('@/components/voyage/VoyageCard', () => ({
  default: ({ voyage }: { voyage: Voyage }) => <div>VoyageCard {voyage.villeDepart}</div>,
}));

vi.mock('@/components/demande/DemandeCard', () => ({
  default: ({ demande }: { demande: Demande }) => <div>DemandeCard {demande.villeDepart}</div>,
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeVoyage(overrides: Partial<Voyage> = {}): Voyage {
  return {
    id: 10, voyageur: makeUser(), villeDepart: 'Yaoundé', villeArrivee: 'Douala',
    dateDepart: '2026-01-10T00:00:00.000Z', dateArrivee: '2026-01-11T00:00:00.000Z',
    poidsDisponible: '20', poidsDisponibleRestant: '20', prixParKilo: '1000',
    commissionProposeePourUnBagage: null, currency: 'XAF', description: null,
    statut: 'actif', isCurrentlyBoosted: false, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeDemande(overrides: Partial<Demande> = {}): Demande {
  return {
    id: 20, client: makeUser({ id: 2 }), villeDepart: 'Douala', villeArrivee: 'Paris',
    dateLimite: '2026-01-15T00:00:00.000Z', poidsEstime: '5', prixParKilo: '1500',
    commissionProposeePourUnBagage: null, currency: 'XAF', description: 'Colis fragile',
    statut: 'en_recherche', isCurrentlyBoosted: false, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeFavori(overrides: Partial<Favori> = {}): Favori {
  return { id: 1, user: makeUser(), voyage: null, demande: null, createdAt: '2026-01-01T00:00:00.000Z', ...overrides };
}

describe('FavoritesList - logique metier', () => {
  it('affiche l onglet Voyages par defaut avec le compte exact', () => {
    render(
      <FavoritesList
        favorisVoyages={[makeFavori({ voyage: makeVoyage() })]}
        favorisDemandes={[makeFavori({ id: 2, demande: makeDemande() }), makeFavori({ id: 3, demande: makeDemande({ id: 21 }) })]}
      />
    );
    expect(screen.getByText('Voyages (1)')).toBeInTheDocument();
    expect(screen.getByText('Demandes (2)')).toBeInTheDocument();
    expect(screen.getByText('VoyageCard Yaoundé')).toBeInTheDocument();
  });

  it('bascule vers l onglet Demandes au clic', async () => {
    const user = userEvent.setup();
    render(
      <FavoritesList
        favorisVoyages={[makeFavori({ voyage: makeVoyage() })]}
        favorisDemandes={[makeFavori({ id: 2, demande: makeDemande() })]}
      />
    );

    await user.click(screen.getByText('Demandes (1)'));
    expect(screen.getByText('DemandeCard Douala')).toBeInTheDocument();
    expect(screen.queryByText(/VoyageCard/)).not.toBeInTheDocument();
  });

  it("affiche un etat vide specifique a l onglet quand il n'y a aucun favori", () => {
    render(<FavoritesList favorisVoyages={[]} favorisDemandes={[]} />);

    expect(screen.getByText('Aucun favori')).toBeInTheDocument();
    expect(screen.getByText(/ajouter des voyages/i)).toBeInTheDocument();
  });

  it('affiche un placeholder de chargement quand isLoading est vrai', () => {
    render(<FavoritesList favorisVoyages={[]} favorisDemandes={[]} isLoading />);

    expect(screen.queryByText('Aucun favori')).not.toBeInTheDocument();
    expect(screen.queryByText(/voyages \(/i)).not.toBeInTheDocument();
  });
});
