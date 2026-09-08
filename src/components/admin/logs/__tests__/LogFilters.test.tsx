import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogFilters from '../LogFilters';

describe('LogFilters - logique metier', () => {
  it("n'affiche pas le bouton Reinitialiser sans filtre actif", () => {
    render(<LogFilters filters={{}} onFiltersChange={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /réinitialiser/i })).not.toBeInTheDocument();
  });

  it('affiche le bouton Reinitialiser des qu un filtre est actif', () => {
    render(<LogFilters filters={{ action: 'ban_user' }} onFiltersChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument();
  });

  it("n'applique pas les filtres tant qu on ne clique pas sur Appliquer (etat local)", async () => {
    const onFiltersChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<LogFilters filters={{}} onFiltersChange={onFiltersChange} />);

    // Les champs de date n'ont pas de <label htmlFor> associe (bug d'accessibilite
    // pre-existant, hors perimetre de cette phase) : ciblage par selecteur direct.
    const startDateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(startDateInput, '2026-01-01');
    expect(onFiltersChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /appliquer les filtres/i }));
    expect(onFiltersChange).toHaveBeenCalledWith(expect.objectContaining({ startDate: '2026-01-01' }));
  });

  it('reinitialise immediatement les filtres (sans attendre Appliquer)', async () => {
    const onFiltersChange = vi.fn();
    const user = userEvent.setup();
    render(<LogFilters filters={{ action: 'ban_user', targetType: 'user' }} onFiltersChange={onFiltersChange} />);

    await user.click(screen.getByRole('button', { name: /réinitialiser/i }));
    expect(onFiltersChange).toHaveBeenCalledWith({});
    expect(screen.queryByRole('button', { name: /réinitialiser/i })).not.toBeInTheDocument();
  });
});
