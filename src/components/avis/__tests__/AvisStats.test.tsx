import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AvisStats from '../AvisStats';
import type { AvisStats as AvisStatsType } from '@/types';

function makeStats(overrides: Partial<AvisStatsType> = {}): AvisStatsType {
  return {
    total: 10,
    average: 4.3,
    distribution: { 1: 0, 2: 1, 3: 1, 4: 3, 5: 5 },
    ...overrides,
  };
}

describe('AvisStats - logique metier', () => {
  it('affiche la moyenne arrondie a une decimale et le total', () => {
    render(<AvisStats stats={makeStats({ average: 4.256, total: 12 })} />);
    expect(screen.getByText('4.3')).toBeInTheDocument();
    expect(screen.getByText(/basé sur 12 avis/i)).toBeInTheDocument();
  });

  it('affiche le compte exact pour chaque niveau de note', () => {
    render(<AvisStats stats={makeStats({ distribution: { 1: 12, 2: 0, 3: 8, 4: 20, 5: 33 } })} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('33')).toBeInTheDocument();
  });

  it("ne plante pas et affiche 0% quand total vaut 0 (aucun avis)", () => {
    render(<AvisStats stats={makeStats({ total: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })} />);
    expect(screen.getByText(/basé sur 0 avis/i)).toBeInTheDocument();
  });
});
