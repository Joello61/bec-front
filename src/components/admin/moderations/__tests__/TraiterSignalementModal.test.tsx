import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Signalement, User } from '@/types';

import TraiterSignalementModal from '../TraiterSignalementModal';

const mockProcessSignalement = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useSignalementActions: () => ({
    processSignalement: mockProcessSignalement,
  }),
}));

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

function makeSignalement(overrides: Partial<Signalement> = {}): Signalement {
  return {
    id: 5,
    signaleur: makeUser(),
    voyage: null,
    demande: null,
    utilisateurSignale: null,
    message: null,
    motif: 'spam',
    description: 'Contenu suspect signalé par plusieurs utilisateurs',
    statut: 'en_attente',
    reponseAdmin: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('TraiterSignalementModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('propose Traiter par defaut', () => {
    render(
      <TraiterSignalementModal signalement={makeSignalement()} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(screen.getByRole('radio', { name: /traiter/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /rejeter/i })).not.toBeChecked();
  });

  it('appelle processSignalement avec le statut traite et soumet avec succes', async () => {
    mockProcessSignalement.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(
      <TraiterSignalementModal signalement={makeSignalement({ id: 42 })} onClose={vi.fn()} onSuccess={onSuccess} />
    );

    await user.type(screen.getByPlaceholderText(/action prise/i), 'Contenu retiré');
    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    expect(mockProcessSignalement).toHaveBeenCalledWith(42, expect.objectContaining({
      statut: 'traite',
      reponseAdmin: 'Contenu retiré',
    }));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('appelle processSignalement avec le statut rejete quand Rejeter est choisi', async () => {
    mockProcessSignalement.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <TraiterSignalementModal signalement={makeSignalement({ id: 43 })} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    await user.click(screen.getByRole('radio', { name: /rejeter/i }));
    expect(screen.getByPlaceholderText(/pourquoi ce signalement est rejeté/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confirmer/i }));

    expect(mockProcessSignalement).toHaveBeenCalledWith(43, expect.objectContaining({ statut: 'rejete' }));
  });
});
