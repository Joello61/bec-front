import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MessageInput from '../MessageInput';

describe('MessageInput - logique metier', () => {
  it("desactive le bouton d'envoi pour un message vide ou uniquement des espaces", async () => {
    const user = userEvent.setup();
    render(<MessageInput onSend={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.type(screen.getByPlaceholderText(/écrivez votre message/i), '   ');
    expect(button).toBeDisabled();
  });

  it('envoie le message nettoye (trim) et vide le champ', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/écrivez votre message/i);
    await user.type(textarea, '  Bonjour  ');
    await user.click(screen.getByRole('button'));

    expect(onSend).toHaveBeenCalledWith('Bonjour');
    expect(textarea).toHaveValue('');
  });

  it('envoie le message sur Entree sans Shift', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSend={onSend} />);

    await user.type(screen.getByPlaceholderText(/écrivez votre message/i), 'Salut{Enter}');
    expect(onSend).toHaveBeenCalledWith('Salut');
  });

  it("n'envoie pas sur Shift+Entree (retour a la ligne)", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/écrivez votre message/i);
    await user.type(textarea, 'Ligne 1{Shift>}{Enter}{/Shift}Ligne 2');

    expect(onSend).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Ligne 1\nLigne 2');
  });

  it('desactive le bouton pendant le chargement', () => {
    render(<MessageInput onSend={vi.fn()} isLoading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
