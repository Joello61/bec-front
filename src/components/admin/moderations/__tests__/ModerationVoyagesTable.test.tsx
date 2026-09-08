import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModerationVoyagesTable from '../ModerationVoyagesTable';
import type { Voyage, User } from '@/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function makeVoyageur(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'voyageur@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: false,
    roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z',
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

function makeVoyage(overrides: Partial<Voyage> = {}): Voyage {
  return {
    id: 10,
    voyageur: makeVoyageur(),
    villeDepart: 'Yaoundé',
    villeArrivee: 'Douala',
    dateDepart: '2026-01-10T00:00:00.000Z',
    dateArrivee: '2026-01-11T00:00:00.000Z',
    poidsDisponible: '20',
    poidsDisponibleRestant: '20',
    prixParKilo: '1000',
    commissionProposeePourUnBagage: null,
    currency: 'XAF',
    description: null,
    statut: 'actif',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ModerationVoyagesTable - logique metier', () => {
  it('affiche le badge de statut correspondant a chaque etat du voyage', () => {
    render(<ModerationVoyagesTable voyages={[makeVoyage({ statut: 'annule' })]} pagination={null} onPageChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Annulé')).toBeInTheDocument();
  });

  it('appelle onDelete avec le voyage cible au clic sur Supprimer', async () => {
    const onDelete = vi.fn();
    const voyage = makeVoyage({ id: 55 });
    const user = userEvent.setup();
    render(<ModerationVoyagesTable voyages={[voyage]} pagination={null} onPageChange={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(onDelete).toHaveBeenCalledWith(voyage);
  });
});
