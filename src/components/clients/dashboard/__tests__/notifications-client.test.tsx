import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppNotification } from '@/types';

import NotificationsPageClient from '../notifications-client';

const mockUseNotifications = vi.fn();
const mockMarkAsRead = vi.fn();
const mockMarkAllAsRead = vi.fn();
const mockDeleteNotification = vi.fn();
const mockRefetch = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useNotifications: () => mockUseNotifications(),
}));

vi.mock('@/components/notification', () => ({
  NotificationList: ({ notifications, onNotificationClick, onDismiss }: {
    notifications: AppNotification[];
    onNotificationClick: (n: AppNotification) => void;
    onDismiss: (id: number) => void;
  }) => (
    <div>
      {notifications.map((n) => (
        <div key={n.id}>
          <button onClick={() => onNotificationClick(n)}>{`Notif ${n.id}`}</button>
          <button onClick={() => onDismiss(n.id)}>{`Dismiss ${n.id}`}</button>
        </div>
      ))}
    </div>
  ),
}));

function makeNotification(overrides: Partial<AppNotification> = {}): AppNotification {
  return {
    id: 1, type: 'new_message', titre: 'Titre', message: 'Message',
    data: null, lue: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('notifications-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un etat de chargement', () => {
    mockUseNotifications.mockReturnValue({ notifications: [], isLoading: true, error: null, markAsRead: mockMarkAsRead, markAllAsRead: mockMarkAllAsRead, deleteNotification: mockDeleteNotification, refetch: mockRefetch });
    render(<NotificationsPageClient />);
    expect(screen.getByText(/chargement des notifications/i)).toBeInTheDocument();
  });

  it("affiche l'etat d'erreur avec un retry", () => {
    mockUseNotifications.mockReturnValue({ notifications: [], isLoading: false, error: 'Erreur reseau', markAsRead: mockMarkAsRead, markAllAsRead: mockMarkAllAsRead, deleteNotification: mockDeleteNotification, refetch: mockRefetch });
    render(<NotificationsPageClient />);
    expect(screen.getByText('Erreur reseau')).toBeInTheDocument();
  });

  it('affiche un etat vide sans notification', () => {
    mockUseNotifications.mockReturnValue({ notifications: [], isLoading: false, error: null, markAsRead: mockMarkAsRead, markAllAsRead: mockMarkAllAsRead, deleteNotification: mockDeleteNotification, refetch: mockRefetch });
    render(<NotificationsPageClient />);
    expect(screen.getByText(/aucune notification/i)).toBeInTheDocument();
  });

  it("marque comme lue une notification non lue au clic", async () => {
    mockUseNotifications.mockReturnValue({ notifications: [makeNotification({ id: 3, lue: false })], isLoading: false, error: null, markAsRead: mockMarkAsRead, markAllAsRead: mockMarkAllAsRead, deleteNotification: mockDeleteNotification, refetch: mockRefetch });
    const user = userEvent.setup();
    render(<NotificationsPageClient />);

    await user.click(screen.getByText('Notif 3'));
    expect(mockMarkAsRead).toHaveBeenCalledWith(3);
  });

  it("n'appelle pas markAsRead pour une notification deja lue", async () => {
    mockUseNotifications.mockReturnValue({ notifications: [makeNotification({ id: 3, lue: true })], isLoading: false, error: null, markAsRead: mockMarkAsRead, markAllAsRead: mockMarkAllAsRead, deleteNotification: mockDeleteNotification, refetch: mockRefetch });
    const user = userEvent.setup();
    render(<NotificationsPageClient />);

    await user.click(screen.getByText('Notif 3'));
    expect(mockMarkAsRead).not.toHaveBeenCalled();
  });

  it('appelle deleteNotification au dismiss', async () => {
    mockUseNotifications.mockReturnValue({ notifications: [makeNotification({ id: 5 })], isLoading: false, error: null, markAsRead: mockMarkAsRead, markAllAsRead: mockMarkAllAsRead, deleteNotification: mockDeleteNotification, refetch: mockRefetch });
    const user = userEvent.setup();
    render(<NotificationsPageClient />);

    await user.click(screen.getByText('Dismiss 5'));
    expect(mockDeleteNotification).toHaveBeenCalledWith(5);
  });
});
