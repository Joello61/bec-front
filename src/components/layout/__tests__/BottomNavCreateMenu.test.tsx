import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomNavCreateMenu from '../BottomNavCreateMenu';

const routes = { mesVoyages: '/mes-voyages', mesDemandes: '/mes-demandes', mesPropositions: '/mes-propositions' };

describe('BottomNavCreateMenu - logique metier', () => {
  it('ne rend rien quand isOpen est false', () => {
    const { container } = render(<BottomNavCreateMenu isOpen={false} onClose={vi.fn()} onNavigate={vi.fn()} routes={routes} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('ferme le menu puis navigue vers Mes voyages', async () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<BottomNavCreateMenu isOpen onClose={onClose} onNavigate={onNavigate} routes={routes} />);

    await user.click(screen.getByText(/gérer mes voyages/i));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith('/mes-voyages');
  });

  it('ferme le menu puis navigue vers Mes propositions', async () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<BottomNavCreateMenu isOpen onClose={onClose} onNavigate={onNavigate} routes={routes} />);

    await user.click(screen.getByText(/gérer mes propositions/i));
    expect(onNavigate).toHaveBeenCalledWith('/mes-propositions');
  });
});
