import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Avis, User } from '@/types';

import ModerationAvisTable from '../ModerationAvisTable';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'auteur@example.com',
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

function makeAvis(overrides: Partial<Avis> = {}): Avis {
  return {
    id: 10,
    auteur: makeUser({ id: 1, prenom: 'John', nom: 'Doe' }),
    cible: makeUser({ id: 2, prenom: 'Jane', nom: 'Smith', email: 'cible@example.com' }),
    voyage: null,
    note: 3,
    commentaire: 'Correct mais en retard',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ModerationAvisTable - logique metier', () => {
  it('affiche un message quand aucun avis ne correspond', () => {
    render(<ModerationAvisTable avisList={[]} pagination={null} onPageChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/aucun avis trouvé/i)).toBeInTheDocument();
  });

  it('affiche un placeholder quand un avis n\'a pas de commentaire', () => {
    render(
      <ModerationAvisTable
        avisList={[makeAvis({ commentaire: null })]}
        pagination={null}
        onPageChange={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText(/aucun commentaire/i)).toBeInTheDocument();
  });

  it('appelle onDelete avec l\'avis cible au clic sur Supprimer', async () => {
    const onDelete = vi.fn();
    const avis = makeAvis({ id: 42 });
    const user = userEvent.setup();
    render(<ModerationAvisTable avisList={[avis]} pagination={null} onPageChange={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /supprimer/i }));
    expect(onDelete).toHaveBeenCalledWith(avis);
  });

  it('affiche auteur et cible distinctement', () => {
    render(
      <ModerationAvisTable
        avisList={[makeAvis()]}
        pagination={null}
        onPageChange={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
