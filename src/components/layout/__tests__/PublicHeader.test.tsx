import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/lib/utils/constants';

import PublicHeader from '../PublicHeader';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => mockUsePathname(),
}));

describe('PublicHeader - logique metier', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue(ROUTES.HOME);
  });

  it('ouvre puis ferme le menu mobile au clic sur le bouton hamburger', async () => {
    const user = userEvent.setup();
    render(<PublicHeader />);

    expect(screen.queryAllByText('Inscription').length).toBeLessThan(2);
    await user.click(screen.getByLabelText(/menu/i));
    // Le menu mobile ajoute un second lien "Inscription" (desktop + mobile).
    expect(screen.getAllByText('Inscription').length).toBeGreaterThanOrEqual(2);

    await user.click(screen.getByLabelText(/menu/i));
    await waitFor(() => expect(screen.queryAllByText('Inscription').length).toBeLessThan(2));
  });

  it('ferme automatiquement le menu mobile quand la route change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PublicHeader />);

    await user.click(screen.getByLabelText(/menu/i));
    expect(screen.getAllByText('Inscription').length).toBeGreaterThanOrEqual(2);

    mockUsePathname.mockReturnValue(ROUTES.ABOUT);
    rerender(<PublicHeader />);

    await waitFor(() => expect(screen.getAllByText('Inscription').length).toBeLessThan(2));
  });
});
