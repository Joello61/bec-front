import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LogFilters from '../LogFilters';

describe('LogFilters - logique metier', () => {
  /**
   * Bug d'accessibilite corrige (Phase 13/Lot F3, plan-correction-cobage.md) : les 4
   * champs de filtre n'etaient pas atteignables via getByLabelText (label sans htmlFor
   * pour les 2 champs de date, pas de prop label sur les 2 Select).
   */
  it('expose les 4 champs de filtre via un label accessible', () => {
    render(<LogFilters filters={{}} onFiltersChange={vi.fn()} />);

    expect(screen.getByLabelText(/type d.action/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type de cible/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de début/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de fin/i)).toBeInTheDocument();
  });

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
    render(<LogFilters filters={{}} onFiltersChange={onFiltersChange} />);

    await user.type(screen.getByLabelText(/date de début/i), '2026-01-01');
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
