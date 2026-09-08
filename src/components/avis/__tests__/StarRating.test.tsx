import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import StarRating from '../StarRating';

describe('StarRating - logique metier', () => {
  it('remplit exactement les etoiles jusqu au rating fourni', () => {
    render(<StarRating rating={3} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
    buttons.slice(0, 3).forEach((btn) => {
      expect(btn.querySelector('svg')).toHaveClass('fill-warning');
    });
    buttons.slice(3).forEach((btn) => {
      expect(btn.querySelector('svg')).not.toHaveClass('fill-warning');
    });
  });

  it('desactive les boutons en mode non interactif et ignore les clics', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<StarRating rating={2} interactive={false} onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    await user.click(buttons[4]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('appelle onChange avec la valeur de l etoile cliquee en mode interactif', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<StarRating rating={2} interactive onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '4 étoiles' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('respecte un maxRating personnalise', () => {
    render(<StarRating rating={1} maxRating={10} />);
    expect(screen.getAllByRole('button')).toHaveLength(10);
  });
});
