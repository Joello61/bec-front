import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ViewsStatCard from '../ViewsStatCard';

describe('ViewsStatCard - logique metier (Lot 6.2)', () => {
  it("n'affiche rien quand ni nombreVues ni nombreVuesLocked ne sont fournis (tiers)", () => {
    const { container } = render(<ViewsStatCard />);

    expect(container).toBeEmptyDOMElement();
  });

  it('affiche le nombre reel de vues quand fourni', () => {
    render(<ViewsStatCard nombreVues={5} />);

    expect(screen.getByText('5 vues')).toBeInTheDocument();
  });

  it('accorde correctement le singulier pour une seule vue', () => {
    render(<ViewsStatCard nombreVues={1} />);

    expect(screen.getByText('1 vue')).toBeInTheDocument();
  });

  it("affiche zero vue plutot que de masquer l'encart", () => {
    render(<ViewsStatCard nombreVues={0} />);

    expect(screen.getByText('0 vue')).toBeInTheDocument();
  });

  it('affiche un encart verrouille avec un lien vers les plans quand nombreVuesLocked est vrai', () => {
    render(<ViewsStatCard nombreVuesLocked />);

    expect(screen.getByText(/verrouillées/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voir les plans/i })).toHaveAttribute(
      'href',
      '/dashboard/settings/subscription'
    );
    expect(screen.queryByText(/^\d+ vues?$/)).not.toBeInTheDocument();
  });

  it('priorise le verrouillage si les deux props sont fournies simultanement', () => {
    render(<ViewsStatCard nombreVues={5} nombreVuesLocked />);

    expect(screen.getByText(/verrouillées/i)).toBeInTheDocument();
    expect(screen.queryByText('5 vues')).not.toBeInTheDocument();
  });
});
