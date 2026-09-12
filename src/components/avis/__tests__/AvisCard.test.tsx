import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Avis, User, Voyage } from '@/types';

import AvisCard from '../AvisCard';

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

function makeAvis(overrides: Partial<Avis> = {}): Avis {
  return {
    id: 1, auteur: makeUser(), cible: makeUser({ id: 2 }), voyage: null,
    note: 4, commentaire: null,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('AvisCard - logique metier', () => {
  it("n'affiche pas de commentaire quand il est absent", () => {
    render(<AvisCard avis={makeAvis({ commentaire: null })} />);
    expect(screen.queryByText(/excellent voyage/i)).not.toBeInTheDocument();
  });

  it('affiche le commentaire quand il est present', () => {
    render(<AvisCard avis={makeAvis({ commentaire: 'Excellent voyage, tres fiable' })} />);
    expect(screen.getByText('Excellent voyage, tres fiable')).toBeInTheDocument();
  });

  it("n'affiche pas de lien vers le voyage quand il est absent", () => {
    render(<AvisCard avis={makeAvis({ voyage: null })} />);
    expect(screen.queryByText(/voir le voyage/i)).not.toBeInTheDocument();
  });

  it('affiche un lien vers le voyage associe quand present', () => {
    render(<AvisCard avis={makeAvis({ voyage: makeVoyage({ id: 42 }) })} />);
    const link = screen.getByText(/voir le voyage/i).closest('a');
    expect(link).toHaveAttribute('href', expect.stringContaining('42'));
  });

  it('affiche la note via StarRating (nombre d etoiles remplies)', () => {
    render(<AvisCard avis={makeAvis({ note: 3 })} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
    expect(buttons[0].querySelector('svg')).toHaveClass('fill-warning');
    expect(buttons[4].querySelector('svg')).not.toHaveClass('fill-warning');
  });
});
