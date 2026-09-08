import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminSidebar from '../AdminSidebar';
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
    id: 1,
    email: 'admin@example.com',
    nom: 'Admin',
    prenom: 'Super',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: false,
    roles: ['ROLE_ADMIN'],
    createdAt: new Date().toISOString(),
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

describe('AdminSidebar - logique metier (navigation active)', () => {
  it("marque uniquement Dashboard actif sur la route exacte du dashboard (pas de correspondance par prefixe)", () => {
    mockUsePathname.mockReturnValue(ROUTES.ADMIN_DASHBOARD);
    mockUseAuth.mockReturnValue({ user: makeUser() });
    render(<AdminSidebar />);

    const dashboardLink = screen.getByRole('link', { name: /^dashboard/i });
    const usersLink = screen.getByRole('link', { name: /utilisateurs/i });
    expect(dashboardLink.firstElementChild).toHaveClass('bg-primary');
    expect(usersLink.firstElementChild).not.toHaveClass('bg-primary');
  });

  it('marque Utilisateurs actif sur une sous-route (correspondance par prefixe)', () => {
    mockUsePathname.mockReturnValue(`${ROUTES.ADMIN_USERS}/42`);
    mockUseAuth.mockReturnValue({ user: makeUser() });
    render(<AdminSidebar />);

    const usersLink = screen.getByRole('link', { name: /utilisateurs/i });
    const dashboardLink = screen.getByRole('link', { name: /^dashboard/i });
    expect(usersLink.firstElementChild).toHaveClass('bg-primary');
    expect(dashboardLink.firstElementChild).not.toHaveClass('bg-primary');
  });

  it("affiche le nom de l'administrateur connecte", () => {
    mockUsePathname.mockReturnValue(ROUTES.ADMIN_DASHBOARD);
    mockUseAuth.mockReturnValue({ user: makeUser({ prenom: 'Alice', nom: 'Martin' }) });
    render(<AdminSidebar />);

    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
  });
});
