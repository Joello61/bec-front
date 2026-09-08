import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../header';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../PublicHeader', () => ({
  default: () => <div>PublicHeader (mock)</div>,
}));

vi.mock('../AuthenticatedHeader', () => ({
  default: () => <div>AuthenticatedHeader (mock)</div>,
}));

describe('Header - logique metier (branchement)', () => {
  it("n'affiche aucun header sur une page d'authentification", () => {
    mockUsePathname.mockReturnValue('/auth/login');
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    const { container } = render(<Header />);
    expect(container).toBeEmptyDOMElement();
  });

  it('affiche PublicHeader quand utilisateur non authentifie', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Header />);
    expect(screen.getByText('PublicHeader (mock)')).toBeInTheDocument();
  });

  it('affiche AuthenticatedHeader quand utilisateur authentifie', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    render(<Header />);
    expect(screen.getByText('AuthenticatedHeader (mock)')).toBeInTheDocument();
  });
});
