import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InAppNotification } from '../InAppNotification';

describe('InAppNotification - logique metier', () => {
  it('appelle onClose automatiquement apres la duree specifiee', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<InAppNotification id="n1" title="Titre" message="Message" duration={3000} onClose={onClose} />);

    act(() => vi.advanceTimersByTime(2999));
    expect(onClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onClose).toHaveBeenCalledWith('n1');
    vi.useRealTimers();
  });

  it("ne se ferme jamais automatiquement quand duration vaut 0", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<InAppNotification id="n1" title="Titre" message="Message" duration={0} onClose={onClose} />);

    act(() => vi.advanceTimersByTime(60000));
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('appelle onClose au clic sur le bouton fermer', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<InAppNotification id="n2" title="Titre" message="Message" duration={0} onClose={onClose} />);

    await user.click(screen.getByLabelText(/fermer/i));
    expect(onClose).toHaveBeenCalledWith('n2');
  });

  it('affiche le titre et le message fournis', () => {
    render(<InAppNotification id="n1" title="Nouveau message" message="Vous avez recu un message" duration={0} onClose={vi.fn()} />);
    expect(screen.getByText('Nouveau message')).toBeInTheDocument();
    expect(screen.getByText('Vous avez recu un message')).toBeInTheDocument();
  });
});
