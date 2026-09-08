import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '../sidebar';
import { ROUTES } from '@/lib/utils/constants';
import type { User } from '@/types';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

describe('sidebar (dashboard) - logique metier', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue(ROUTES.DASHBOARD);
  });

  it("n'affiche pas le lien Administration pour un utilisateur standard", () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ roles: ['ROLE_USER'] }) });
    render(<Sidebar />);
    expect(screen.queryByText('Administration')).not.toBeInTheDocument();
  });

  it('affiche le lien Administration pour un administrateur', () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ roles: ['ROLE_USER', 'ROLE_ADMIN'] }) });
    render(<Sidebar />);
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });

  it("marque Mes Voyages actif sur une sous-route (prefixe)", () => {
    mockUsePathname.mockReturnValue(`${ROUTES.MES_VOYAGES}/5`);
    mockUseAuth.mockReturnValue({ user: makeUser() });
    render(<Sidebar />);
    expect(screen.getByText('Mes Voyages').closest('div')).toHaveClass('text-white');
  });

  it("ne marque pas Mes Demandes actif quand seule une sous-route de Mes Voyages est active", () => {
    mockUsePathname.mockReturnValue(`${ROUTES.MES_VOYAGES}/5`);
    mockUseAuth.mockReturnValue({ user: makeUser() });
    render(<Sidebar />);
    expect(screen.getByText('Mes Demandes').closest('div')).not.toHaveClass('text-white');
  });
});
