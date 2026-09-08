import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProfileHeader from '../UserProfileHeader';
import type { User } from '@/types';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: false,
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

describe('UserProfileHeader - logique metier', () => {
  it("propose Modifier sur son propre profil, jamais Contacter", () => {
    render(<UserProfileHeader user={makeUser()} isOwnProfile onEdit={vi.fn()} onMessage={vi.fn()} />);
    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /contacter/i })).not.toBeInTheDocument();
  });

  it("propose Contacter sur le profil d'un autre utilisateur, jamais Modifier", () => {
    render(<UserProfileHeader user={makeUser()} isOwnProfile={false} onEdit={vi.fn()} onMessage={vi.fn()} />);
    expect(screen.getByRole('button', { name: /contacter/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /modifier/i })).not.toBeInTheDocument();
  });

  it("n'affiche aucun bouton d'action sur le profil d'un tiers sans onMessage", () => {
    render(<UserProfileHeader user={makeUser()} isOwnProfile={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it("n'affiche le telephone que s'il est renseigne", () => {
    const { rerender } = render(<UserProfileHeader user={makeUser({ telephone: null })} />);
    expect(screen.queryByText(/\+237/)).not.toBeInTheDocument();

    rerender(<UserProfileHeader user={makeUser({ telephone: '+237612345678' })} />);
    expect(screen.getByText(/237/)).toBeInTheDocument();
  });

  it("appelle onEdit au clic sur Modifier", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<UserProfileHeader user={makeUser()} isOwnProfile onEdit={onEdit} />);

    await user.click(screen.getByRole('button', { name: /modifier/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
