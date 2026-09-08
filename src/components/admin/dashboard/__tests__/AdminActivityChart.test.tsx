import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminActivityChart from '../AdminActivityChart';
import type { AdminActivityStats, AdminDayActivity } from '@/types';

function makeDay(overrides: Partial<AdminDayActivity> = {}): AdminDayActivity {
  return {
    date: '2026-01-05',
    dayName: 'Lundi',
    inscriptions: 2,
    voyages: 1,
    demandes: 0,
    signalements: 0,
    ...overrides,
  };
}

function makeActivity(overrides: Partial<AdminActivityStats> = {}): AdminActivityStats {
  return {
    derniers7Jours: [makeDay()],
    tendance: { direction: 'hausse', percentage: 12.34 },
    ...overrides,
  };
}

describe('AdminActivityChart - logique metier', () => {
  it('affiche le pourcentage de tendance avec le signe + en cas de hausse', () => {
    render(<AdminActivityChart activity={makeActivity({ tendance: { direction: 'hausse', percentage: 12.34 } })} />);
    expect(screen.getByText('+12.3%')).toBeInTheDocument();
  });

  it('affiche le pourcentage sans signe en cas de baisse', () => {
    render(<AdminActivityChart activity={makeActivity({ tendance: { direction: 'baisse', percentage: -8.5 } })} />);
    expect(screen.getByText('-8.5%')).toBeInTheDocument();
  });

  it("n'affiche pas le detail signalements quand il vaut 0", () => {
    render(<AdminActivityChart activity={makeActivity({ derniers7Jours: [makeDay({ signalements: 0 })] })} />);
    expect(screen.queryByText(/signalements/)).not.toBeInTheDocument();
  });

  it('affiche le detail signalements quand il est superieur a 0', () => {
    render(<AdminActivityChart activity={makeActivity({ derniers7Jours: [makeDay({ signalements: 3 })] })} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('signalements')).toBeInTheDocument();
  });

  it("ne plante pas quand tous les jours sont a zero (division par le maximum)", () => {
    const emptyDay = makeDay({ inscriptions: 0, voyages: 0, demandes: 0, signalements: 0 });
    render(<AdminActivityChart activity={makeActivity({ derniers7Jours: [emptyDay] })} />);
    expect(screen.getByText('0 actions')).toBeInTheDocument();
  });
});
