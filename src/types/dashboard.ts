import type { NotificationType } from './notification';

export interface DashboardSummary {
  voyagesActifs: number;
  demandesEnCours: number;
  notificationsNonLues: number;
  messagesNonLus: number;
}

export interface DashboardVoyage {
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  dateArrivee: string;
  statut: string;
  poidsDisponible: string;
}

export interface DashboardDemande {
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateLimite: string | null;
  statut: string;
  poidsEstime: string;
}

export interface DashboardNotification {
  id: number;
  type: NotificationType;
  titre: string;
  message: string;
  lue: boolean;
  createdAt: string;
  data: Record<string, unknown> | null;
}

export interface DashboardMessage {
  id: number;
  expediteur: {
    id: number;
    nom: string;
    prenom: string;
  };
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export interface DashboardStats {
  voyagesEffectues: number;
  bagagesTransportes: number;
  noteMoyenne: number;
  nombreAvis: number;
  repartitionNotes: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface DashboardData {
  summary: DashboardSummary;
  voyages: {
    total: number;
    actifs: number;
    recents: DashboardVoyage[];
  };
  demandes: {
    total: number;
    enCours: number;
    recentes: DashboardDemande[];
  };
  notifications: {
    nonLues: number;
    recentes: DashboardNotification[];
  };
  messages: {
    nonLus: number;
    recents: DashboardMessage[];
  };
  stats: DashboardStats;
}