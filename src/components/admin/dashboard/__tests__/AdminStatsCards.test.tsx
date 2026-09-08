import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { AdminDemandesStats, AdminSignalementsStats, AdminUsersStats, AdminVoyagesStats } from '@/types';

import AdminStatsCards from '../AdminStatsCards';

function makeProps(overrides: {
  users?: Partial<AdminUsersStats>;
  voyages?: Partial<AdminVoyagesStats>;
  demandes?: Partial<AdminDemandesStats>;
  signalements?: Partial<AdminSignalementsStats>;
} = {}) {
  const users: AdminUsersStats = {
    total: 100, actifs: 90, bannis: 2, nouveauxCeMois: 5, nouveauxAujourdhui: 0,
    emailVerifies: 80, telephoneVerifies: 60, admins: 3, moderators: 1,
    tauxVerificationEmail: 0.8, tauxVerificationTelephone: 0.6, ...overrides.users,
  };
  const voyages: AdminVoyagesStats = {
    total: 50, actifs: 20, complets: 20, termines: 5, annules: 5,
    nouveauxCeMois: 10, nouveauxAujourdhui: 0, tauxReussite: 0.8, ...overrides.voyages,
  };
  const demandes: AdminDemandesStats = {
    total: 40, enRecherche: 15, voyageurTrouve: 20, annulees: 5,
    nouvellesCeMois: 8, nouvellesAujourdhui: 0, tauxReussite: 0.75, ...overrides.demandes,
  };
  const signalements: AdminSignalementsStats = {
    total: 10, enAttente: 4, traites: 5, rejetes: 1, nouveauxCeMois: 0, tauxTraitement: 0.6, ...overrides.signalements,
  };
  return { users, voyages, demandes, signalements };
}

describe('AdminStatsCards - logique metier', () => {
  it('affiche le total et les actifs de chaque categorie', () => {
    render(<AdminStatsCards {...makeProps()} />);

    expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Voyages')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('affiche la croissance (+n) quand des elements sont crees aujourd hui', () => {
    render(<AdminStatsCards {...makeProps({ users: { nouveauxAujourdhui: 3 } })} />);
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it("affiche 0 sans signe plus quand rien n'a ete cree aujourd'hui", () => {
    render(<AdminStatsCards {...makeProps()} />);
    expect(screen.queryByText(/^\+0$/)).not.toBeInTheDocument();
  });
});
