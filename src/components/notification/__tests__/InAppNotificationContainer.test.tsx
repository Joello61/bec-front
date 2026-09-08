import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InAppNotificationContainer } from '../InAppNotificationContainer';

describe('InAppNotificationContainer - logique metier', () => {
  it('affiche toutes les notifications fournies', () => {
    render(
      <InAppNotificationContainer
        notifications={[
          { id: 'n1', title: 'Premiere', message: 'Message 1', duration: 0 },
          { id: 'n2', title: 'Deuxieme', message: 'Message 2', duration: 0 },
        ]}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('Premiere')).toBeInTheDocument();
    expect(screen.getByText('Deuxieme')).toBeInTheDocument();
  });

  it("appelle onClose avec l'id de la notification fermee", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <InAppNotificationContainer
        notifications={[{ id: 'n1', title: 'Notif', message: 'Message', duration: 0 }]}
        onClose={onClose}
      />
    );

    await user.click(screen.getByLabelText(/fermer/i));
    expect(onClose).toHaveBeenCalledWith('n1');
  });
});
