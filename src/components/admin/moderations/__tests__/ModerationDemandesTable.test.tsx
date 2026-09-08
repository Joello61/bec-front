import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModerationDemandesTable from '../ModerationDemandesTable';
import type { Demande, User } from '@/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function makeClient(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'client@example.com',
    nom: 'Doe',
    prenom: 'Jane',
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

function makeDemande(overrides: Partial<Demande> = {}): Demande {
  return {
    id: 20,
    client: makeClient(),
    villeDepart: 'Douala',
    villeArrivee: 'Paris',
    dateLimite: '2026-01-15T00:00:00.000Z',
    poidsEstime: '5',
    prixParKilo: '1500',
    commissionProposeePourUnBagage: null,
    currency: 'XAF',
    description: 'Colis fragile',
    statut: 'en_recherche',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ModerationDemandesTable - logique metier', () => {
  it('affiche le badge de statut correspondant a chaque etat de la demande', () => {
    render(<ModerationDemandesTable demandes={[makeDemande({ statut: 'voyageur_trouve' })]} pagination={null} onPageChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Voyageur trouvé')).toBeInTheDocument();
  });

  it('appelle onDelete avec la demande ciblee au clic sur Supprimer', async () => {
    const onDelete = vi.fn();
    const demande = makeDemande({ id: 66 });
    const user = userEvent.setup();
    render(<ModerationDemandesTable demandes={[demande]} pagination={null} onPageChange={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(onDelete).toHaveBeenCalledWith(demande);
  });
});
