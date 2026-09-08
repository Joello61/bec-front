import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { User } from '@/types';

import BottomNavAccountMenu from '../BottomNavAccountMenu';

const routes = { mesVoyages: '/mes-voyages', mesDemandes: '/mes-demandes', favoris: '/favoris', profile: '/profile', settings: '/settings' };

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

describe('BottomNavAccountMenu - logique metier', () => {
  it('ne rend rien quand isOpen est false', () => {
    const { container } = render(
      <BottomNavAccountMenu isOpen={false} onClose={vi.fn()} user={makeUser()} onNavigate={vi.fn()} onLogout={vi.fn()} routes={routes} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("affiche le nom et l'email de l'utilisateur connecte", () => {
    render(
      <BottomNavAccountMenu isOpen onClose={vi.fn()} user={makeUser({ prenom: 'Alice', nom: 'Martin', email: 'alice@example.com' })} onNavigate={vi.fn()} onLogout={vi.fn()} routes={routes} />
    );
    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('ferme le menu puis navigue vers Favoris', async () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<BottomNavAccountMenu isOpen onClose={onClose} user={makeUser()} onNavigate={onNavigate} onLogout={vi.fn()} routes={routes} />);

    await user.click(screen.getByText(/favoris/i));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith('/favoris');
  });

  it('ferme le menu puis appelle onLogout au clic sur Deconnexion', async () => {
    const onClose = vi.fn();
    const onLogout = vi.fn();
    const user = userEvent.setup();
    render(<BottomNavAccountMenu isOpen onClose={onClose} user={makeUser()} onNavigate={vi.fn()} onLogout={onLogout} routes={routes} />);

    await user.click(screen.getByText(/déconnexion/i));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
