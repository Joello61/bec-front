import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserCard from '../UserCard';
import type { User } from '@/types';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 7,
    email: 'user@example.com',
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

describe('UserCard - logique metier', () => {
  it("n'affiche pas la bio quand elle est absente", () => {
    render(<UserCard user={makeUser({ bio: null })} />);
    expect(screen.queryByText(/voyageur/i)).not.toBeInTheDocument();
  });

  it('affiche la bio quand elle est presente', () => {
    render(<UserCard user={makeUser({ bio: 'Voyageur regulier' })} />);
    expect(screen.getByText('Voyageur regulier')).toBeInTheDocument();
  });

  it("n'affiche pas la note moyenne sans averageRating", () => {
    render(<UserCard user={makeUser()} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('affiche la note moyenne et le nombre d avis quand fournis', () => {
    render(<UserCard user={makeUser()} averageRating={4.567} totalAvis={12} />);
    expect(screen.getByText('4.6')).toBeInTheDocument();
    expect(screen.getByText('(12)')).toBeInTheDocument();
  });

  it("n'affiche pas le bouton Contacter sans onMessage", () => {
    render(<UserCard user={makeUser()} />);
    expect(screen.queryByRole('button', { name: /contacter/i })).not.toBeInTheDocument();
  });

  it('appelle onMessage au clic sur Contacter', async () => {
    const onMessage = vi.fn();
    const user = userEvent.setup();
    render(<UserCard user={makeUser()} onMessage={onMessage} />);

    await user.click(screen.getByRole('button', { name: /contacter/i }));
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
});
