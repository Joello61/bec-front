import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { AppNotification } from '@/types';

import NotificationList from '../NotificationList';

vi.mock('../NotificationItem', () => ({
  default: ({ notification, onClick, onDismiss }: {
    notification: AppNotification; onClick: () => void; onDismiss?: () => void;
  }) => (
    <div>
      <button onClick={onClick}>{notification.titre}</button>
      {onDismiss && <button onClick={onDismiss}>{`Dismiss ${notification.id}`}</button>}
    </div>
  ),
}));

function makeNotification(overrides: Partial<AppNotification> = {}): AppNotification {
  return {
    id: 1, type: 'new_message', titre: 'Notification 1', message: 'Message',
    data: null, lue: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('NotificationList - logique metier', () => {
  it('affiche un etat vide sans notification', () => {
    render(<NotificationList notifications={[]} />);
    expect(screen.getByText(/aucune notification/i)).toBeInTheDocument();
  });

  it("n'affiche pas 'Tout marquer comme lu' quand toutes les notifications sont lues", () => {
    render(<NotificationList notifications={[makeNotification({ lue: true })]} onMarkAllAsRead={vi.fn()} />);
    expect(screen.queryByText(/tout marquer comme lu/i)).not.toBeInTheDocument();
  });

  it("affiche 'Tout marquer comme lu' des qu'une notification est non lue", () => {
    render(<NotificationList notifications={[makeNotification({ lue: false })]} onMarkAllAsRead={vi.fn()} />);
    expect(screen.getByText(/tout marquer comme lu/i)).toBeInTheDocument();
  });

  it('appelle onNotificationClick avec la notification cliquee', async () => {
    const onNotificationClick = vi.fn();
    const notif = makeNotification({ id: 5, titre: 'Ma notification' });
    const user = userEvent.setup();
    render(<NotificationList notifications={[notif]} onNotificationClick={onNotificationClick} />);

    await user.click(screen.getByText('Ma notification'));
    expect(onNotificationClick).toHaveBeenCalledWith(notif);
  });

  it("appelle onDismiss avec l'id de la notification supprimee", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<NotificationList notifications={[makeNotification({ id: 7 })]} onDismiss={onDismiss} />);

    await user.click(screen.getByText('Dismiss 7'));
    expect(onDismiss).toHaveBeenCalledWith(7);
  });
});
