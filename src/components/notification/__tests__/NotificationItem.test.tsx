import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { AppNotification } from '@/types';

import NotificationItem from '../NotificationItem';

function makeNotification(overrides: Partial<AppNotification> = {}): AppNotification {
  return {
    id: 1, type: 'new_message', titre: 'Nouveau message', message: 'Vous avez recu un message',
    data: null, lue: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('NotificationItem - logique metier', () => {
  it('appelle onClick au clic sur la notification', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NotificationItem notification={makeNotification()} onClick={onClick} />);

    await user.click(screen.getByText('Nouveau message'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("n'affiche pas le bouton de suppression sans onDismiss", () => {
    render(<NotificationItem notification={makeNotification()} onClick={vi.fn()} />);
    expect(screen.queryByLabelText(/supprimer la notification/i)).not.toBeInTheDocument();
  });

  it("appelle onDismiss sans declencher onClick (stopPropagation)", async () => {
    const onClick = vi.fn();
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<NotificationItem notification={makeNotification()} onClick={onClick} onDismiss={onDismiss} />);

    await user.click(screen.getByLabelText(/supprimer la notification/i));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
