import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import NotificationBell from '../NotificationBell';

describe('NotificationBell - logique metier', () => {
  it("n'affiche pas de badge quand count vaut 0", () => {
    render(<NotificationBell count={0} />);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('affiche le compte exact sous 10', () => {
    render(<NotificationBell count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('plafonne le badge a "9+" au-dela de 9', () => {
    render(<NotificationBell count={42} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it("enveloppe dans un lien vers Notifications par defaut", () => {
    render(<NotificationBell count={1} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', expect.stringContaining('notification'));
  });

  it("n'affiche pas de lien quand asLink est false", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NotificationBell count={1} asLink={false} onClick={onClick} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
