import { describe, expect, it } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastProvider from '../ToastProvider';

function dispatchShowToast(detail: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail }));
}

describe('ToastProvider - logique metier', () => {
  it("affiche un toast recu via l'evenement show-toast", () => {
    render(<ToastProvider />);

    act(() => dispatchShowToast({ id: 't1', type: 'success', message: 'Operation reussie' }));

    expect(screen.getByText('Operation reussie')).toBeInTheDocument();
  });

  it('empile plusieurs toasts recus successivement', () => {
    render(<ToastProvider />);

    act(() => dispatchShowToast({ id: 't1', type: 'success', message: 'Premier message' }));
    act(() => dispatchShowToast({ id: 't2', type: 'error', message: 'Deuxieme message' }));

    expect(screen.getByText('Premier message')).toBeInTheDocument();
    expect(screen.getByText('Deuxieme message')).toBeInTheDocument();
  });

  it('retire uniquement le toast ferme par son bouton de fermeture', async () => {
    const user = userEvent.setup();
    render(<ToastProvider />);

    act(() => dispatchShowToast({ id: 't1', type: 'success', message: 'Premier message' }));
    act(() => dispatchShowToast({ id: 't2', type: 'error', message: 'Deuxieme message' }));

    const closeButtons = screen.getAllByLabelText(/fermer/i);
    await user.click(closeButtons[0]);

    await waitFor(() => expect(screen.queryByText('Premier message')).not.toBeInTheDocument());
    expect(screen.getByText('Deuxieme message')).toBeInTheDocument();
  });
});
