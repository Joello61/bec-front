import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import FavoriteButton from '../FavoriteButton';

describe('FavoriteButton - logique metier', () => {
  it('affiche le libelle "Ajouter aux favoris" quand ce n est pas un favori', () => {
    render(<FavoriteButton isFavorite={false} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Ajouter aux favoris')).toBeInTheDocument();
  });

  it('affiche le libelle "Retirer des favoris" quand c est deja un favori', () => {
    render(<FavoriteButton isFavorite={true} onToggle={vi.fn()} />);
    expect(screen.getByLabelText('Retirer des favoris')).toBeInTheDocument();
  });

  it('appelle onToggle au clic', async () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);

    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('desactive le bouton pendant le traitement pour eviter un double clic', async () => {
    let resolveToggle!: () => void;
    const onToggle = vi.fn(() => new Promise<void>((resolve) => { resolveToggle = resolve; }));
    const user = userEvent.setup();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);
    expect(button).toBeDisabled();

    resolveToggle();
    await waitFor(() => expect(button).toBeEnabled());
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("n'empeche pas la propagation de l'evenement parent (preventDefault/stopPropagation appliques)", async () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    const parentClick = vi.fn();
    const user = userEvent.setup();
    render(
      <div onClick={parentClick}>
        <FavoriteButton isFavorite={false} onToggle={onToggle} />
      </div>
    );

    await user.click(screen.getByRole('button'));
    expect(parentClick).not.toHaveBeenCalled();
  });
});
