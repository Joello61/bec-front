import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InAppNotificationProvider } from '../InAppNotificationProvider';

const mockClear = vi.fn();
const mockRemoveNotification = vi.fn();
const mockUseRealTimeNotificationStore = vi.fn();

vi.mock('@/lib/store/realTimeNotificationStore', () => ({
  useRealTimeNotificationStore: (selector: (state: unknown) => unknown) => selector(mockUseRealTimeNotificationStore()),
}));

vi.mock('@/components/notification/InAppNotificationContainer', () => ({
  InAppNotificationContainer: ({ notifications }: { notifications: Array<{ id: string; message: string }> }) => (
    <div data-testid="notif-container">{notifications.length} notification(s)</div>
  ),
}));

describe('InAppNotificationProvider - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRealTimeNotificationStore.mockReturnValue({
      realTimeNotifications: [{ id: '1', message: 'Nouveau message' }],
      removeNotification: mockRemoveNotification,
      clear: mockClear,
    });
  });

  it('purge les notifications residuelles au montage', () => {
    render(
      <InAppNotificationProvider>
        <div>Enfant</div>
      </InAppNotificationProvider>
    );
    expect(mockClear).toHaveBeenCalledTimes(1);
  });

  it('rend les enfants et transmet les notifications du store au conteneur', () => {
    render(
      <InAppNotificationProvider>
        <div>Contenu applicatif</div>
      </InAppNotificationProvider>
    );
    expect(screen.getByText('Contenu applicatif')).toBeInTheDocument();
    expect(screen.getByTestId('notif-container')).toHaveTextContent('1 notification(s)');
  });
});
