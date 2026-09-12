import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Demande, Signalement, User, Voyage } from '@/types';

import SignalementsTable from '../SignalementsTable';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'signaleur@example.com',
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
    voyageur: makeUser(),
    villeDepart: 'Douala',
    villeArrivee: 'Yaoundé',
    dateDepart: '2026-01-10T00:00:00.000Z',
    dateArrivee: '2026-01-11T00:00:00.000Z',
    poidsDisponible: '20',
    poidsDisponibleRestant: '20',
    prixParKilo: '1000',
    commissionProposeePourUnBagage: null,
    currency: 'XAF',
    description: null,
    statut: 'actif',
    isCurrentlyBoosted: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeDemande(overrides: Partial<Demande> = {}): Demande {
  return {
    id: 20,
    client: makeUser(),
    villeDepart: 'Paris',
    villeArrivee: 'Lyon',
    dateLimite: '2026-01-10T00:00:00.000Z',
    poidsEstime: '5',
    prixParKilo: '1000',
    commissionProposeePourUnBagage: null,
    currency: 'EUR',
    description: 'Colis fragile',
    statut: 'en_recherche',
    isCurrentlyBoosted: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeSignalement(overrides: Partial<Signalement> = {}): Signalement {
  return {
    id: 1,
    signaleur: makeUser(),
    voyage: null,
    demande: null,
    utilisateurSignale: null,
    message: null,
    motif: 'spam',
    description: 'Contenu suspect',
    statut: 'en_attente',
    reponseAdmin: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('SignalementsTable - detection de la cible', () => {
  it('priorise le voyage quand un voyage est present', () => {
    render(
      <SignalementsTable
        signalements={[makeSignalement({
          voyage: makeVoyage(),
          demande: makeDemande(),
        })]}
        pagination={null}
        onPageChange={vi.fn()}
        onTraiter={vi.fn()}
      />
    );
    expect(screen.getByText('Voyage')).toBeInTheDocument();
    expect(screen.getByText(/Douala vers Yaoundé/)).toBeInTheDocument();
  });

  it('detecte une demande en absence de voyage', () => {
    render(
      <SignalementsTable
        signalements={[makeSignalement({ demande: makeDemande() })]}
        pagination={null}
        onPageChange={vi.fn()}
        onTraiter={vi.fn()}
      />
    );
    expect(screen.getByText('Demande')).toBeInTheDocument();
  });

  it('detecte un utilisateur signale en dernier recours', () => {
    render(
      <SignalementsTable
        signalements={[makeSignalement({ utilisateurSignale: makeUser({ prenom: 'Jane', nom: 'Smith' }) })]}
        pagination={null}
        onPageChange={vi.fn()}
        onTraiter={vi.fn()}
      />
    );
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('affiche "Déjà traité" et aucun bouton d\'action pour un signalement traite', () => {
    render(
      <SignalementsTable
        signalements={[makeSignalement({ statut: 'traite' })]}
        pagination={null}
        onPageChange={vi.fn()}
        onTraiter={vi.fn()}
      />
    );
    expect(screen.getByText(/déjà traité/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /traiter/i })).not.toBeInTheDocument();
  });

  it('appelle onTraiter avec le signalement cible pour un signalement en attente', async () => {
    const onTraiter = vi.fn();
    const signalement = makeSignalement({ id: 77 });
    const user = userEvent.setup();
    render(
      <SignalementsTable
        signalements={[signalement]}
        pagination={null}
        onPageChange={vi.fn()}
        onTraiter={onTraiter}
      />
    );

    await user.click(screen.getByRole('button', { name: /traiter/i }));
    expect(onTraiter).toHaveBeenCalledWith(signalement);
  });
});
