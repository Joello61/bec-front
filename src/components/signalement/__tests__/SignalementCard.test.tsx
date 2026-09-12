import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Demande, Message, Signalement, User, Voyage } from '@/types';

import SignalementCard from '../SignalementCard';

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

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 1, expediteur: makeUser(), destinataire: makeUser({ id: 2 }),
    contenu: 'Bonjour', lu: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeSignalement(overrides: Partial<Signalement> = {}): Signalement {
  return {
    id: 1, signaleur: makeUser(), voyage: null, demande: null, utilisateurSignale: null, message: null,
    motif: 'spam', description: 'Ceci est un spam evident', statut: 'en_attente', reponseAdmin: null,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('SignalementCard - logique metier', () => {
  it('identifie un signalement de voyage en priorite', () => {
    render(<SignalementCard signalement={makeSignalement({ voyage: makeVoyage(), demande: makeDemande() })} />);
    expect(screen.getByText('Voyage')).toBeInTheDocument();
    expect(screen.getByText('Yaoundé vers Douala')).toBeInTheDocument();
  });

  it('identifie un signalement de demande quand aucun voyage n est associe', () => {
    render(<SignalementCard signalement={makeSignalement({ demande: makeDemande() })} />);
    expect(screen.getByText('Demande')).toBeInTheDocument();
    expect(screen.getByText('Douala vers Paris')).toBeInTheDocument();
  });

  it('identifie un signalement de message', () => {
    render(<SignalementCard signalement={makeSignalement({ message: makeMessage() })} />);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('identifie un signalement d utilisateur', () => {
    render(<SignalementCard signalement={makeSignalement({ utilisateurSignale: makeUser({ prenom: 'Alice', nom: 'Martin' }) })} />);
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
  });

  it('affiche le libelle du motif traduit', () => {
    render(<SignalementCard signalement={makeSignalement({ motif: 'arnaque' })} />);
    expect(screen.getByText('Arnaque ou fraude')).toBeInTheDocument();
  });

  it('affiche le badge de statut correspondant', () => {
    render(<SignalementCard signalement={makeSignalement({ statut: 'traite' })} />);
    expect(screen.getByText('Traité')).toBeInTheDocument();
  });

  it("n'affiche pas de reponse admin quand elle est absente", () => {
    render(<SignalementCard signalement={makeSignalement({ reponseAdmin: null })} />);
    expect(screen.queryByText(/réponse de l'équipe/i)).not.toBeInTheDocument();
  });

  it('affiche la reponse admin quand elle est presente', () => {
    render(<SignalementCard signalement={makeSignalement({ reponseAdmin: 'Signalement traite, merci' })} />);
    expect(screen.getByText('Signalement traite, merci')).toBeInTheDocument();
  });

  it("n'affiche pas la date de mise a jour si elle est identique a la date de creation", () => {
    render(<SignalementCard signalement={makeSignalement({ createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' })} />);
    expect(screen.queryByText(/mis à jour le/i)).not.toBeInTheDocument();
  });

  it('affiche la date de mise a jour quand elle differe de la date de creation', () => {
    render(<SignalementCard signalement={makeSignalement({ createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-05T00:00:00.000Z' })} />);
    expect(screen.getByText(/mis à jour le/i)).toBeInTheDocument();
  });
});
