import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../footer';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('Footer - logique metier (masquage par route)', () => {
  it('affiche le footer sur une page publique', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);
    expect(screen.getByText(/tous droits réservés/i)).toBeInTheDocument();
  });

  it("masque le footer sur une page d'authentification", () => {
    mockUsePathname.mockReturnValue('/auth/login');
    const { container } = render(<Footer />);
    expect(container).toBeEmptyDOMElement();
  });

  it('masque le footer sur une page du dashboard', () => {
    mockUsePathname.mockReturnValue('/dashboard/explore');
    const { container } = render(<Footer />);
    expect(container).toBeEmptyDOMElement();
  });

  it('masque le footer sur une page admin', () => {
    mockUsePathname.mockReturnValue('/admin/users');
    const { container } = render(<Footer />);
    expect(container).toBeEmptyDOMElement();
  });
});
