import type { BoostOffer } from './boost';
import type { Demande } from './demande'
import type { PaymentMethod, SubscriptionPlan } from './subscription';
import type { Voyage } from './voyage';

// ==================== DASHBOARD & STATS ====================
export interface AdminDashboardData {
  users: AdminUsersStats;
  voyages: AdminVoyagesStats;
  demandes: AdminDemandesStats;
  signalements: AdminSignalementsStats;
  activity: AdminActivityStats;
  engagement: AdminEngagementStats;
}

export interface AdminUsersStats {
  total: number;
  actifs: number;
  bannis: number;
  nouveauxCeMois: number;
  nouveauxAujourdhui: number;
  emailVerifies: number;
  telephoneVerifies: number;
  admins: number;
  moderators: number;
  tauxVerificationEmail: number;
  tauxVerificationTelephone: number;
}

export interface AdminUsersDetailedStats {
  global: AdminUsersStats;
  detailed: Array<{
    date: string;
    inscriptions: number;
  }>;
  authProviders: {
    local: {
      count: number;
      percentage: number;
    };
    google: {
      count: number;
      percentage: number;
    };
    facebook: {
      count: number;
      percentage: number;
    };
  };
}

export interface AdminVoyagesStats {
  total: number;
  actifs: number;
  complets: number;
  termines: number;
  annules: number;
  nouveauxCeMois: number;
  nouveauxAujourdhui: number;
  tauxReussite: number;
}

export interface AdminDemandesStats {
  total: number;
  enRecherche: number;
  voyageurTrouve: number;
  annulees: number;
  nouvellesCeMois: number;
  nouvellesAujourdhui: number;
  tauxReussite: number;
}

export interface AdminSignalementsStats {
  total: number;
  enAttente: number;
  traites: number;
  rejetes: number;
  nouveauxCeMois: number;
  tauxTraitement: number;
}

export interface AdminActivityStats {
  derniers7Jours: AdminDayActivity[];
  tendance: {
    direction: 'hausse' | 'baisse' | 'stable';
    percentage: number;
  };
}

export interface AdminDayActivity {
  date: string;
  dayName: string;
  inscriptions: number;
  voyages: number;
  demandes: number;
  signalements: number;
}

export interface AdminEngagementStats {
  totalAvis: number;
  totalMessages: number;
  totalConversations: number;
  moyenneAvisParUtilisateur: number;
  utilisateursAvecAvis: number;
}

// ==================== LOGS ====================
export type AdminActionType =
  | 'ban_user'
  | 'unban_user'
  | 'update_roles'
  | 'delete_user'
  | 'delete_voyage'
  | 'delete_demande'
  | 'delete_avis'
  | 'delete_message'
  | 'delete_all_user_content'
  | 'approve_signalement'
  | 'reject_signalement';

export type AdminTargetType = 'user' | 'voyage' | 'demande' | 'avis' | 'message' | 'signalement';

export interface AdminLog {
  id: number;
  admin: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
  };
  action: AdminActionType;
  targetType: AdminTargetType;
  targetId: number;
  details: {
    email?: string;
    reason?: string;
    [key: string]: unknown;
  } | null;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export interface AdminLogFilters {
  action?: AdminActionType;
  targetType?: AdminTargetType;
  adminId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminLogStats {
  todayActions: number;
  weekActions: number;
  monthActions: number;
  mostActiveAdmins: Array<{
    admin: {
      id: number;
      email: string;
      nom: string;
      prenom: string;
    };
    count: number;
  }>;
  mostFrequentActions: Array<{
    action: AdminActionType;
    count: number;
  }>;
}

// ==================== ACTIONS INPUT ====================
export interface BanUserInput {
  reason: string;
  type: 'permanent' | 'temporary';
  bannedUntil?: string;
  notifyUser?: boolean;
  deleteContent?: boolean;
}

export interface UpdateUserRolesInput {
  roles: string[];
  reason?: string;
  notifyUser?: boolean;
}

export interface DeleteContentInput {
  reason: string;
  motif: 'spam' | 'fraude' | 'harcelement' | 'contenu_inapproprie' | 'autre';
  notifyUser?: boolean;
  banUser?: boolean;
  banReason?: string;
  deleteAllUserContent?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  internalNotes?: string;
}

// ==================== FILTERS ====================
export interface AdminUserFilters {
  role?: string;
  banned?: boolean;
  verified?: boolean;
  search?: string;
}

export interface AdminModerationFilters {
  type?: 'voyage' | 'demande' | 'avis' | 'message';
  userId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminAvisFilters {
  maxNote?: number;
}

export interface AdminContentListFilters {
  search?: string;
  statut?: string;
}

// ==================== USER ACTIVITY ====================
export interface AdminUserActivity {
  voyages: Voyage[];
  demandes: Demande[];
  messagesCount: number;
  avisCount: number;
  signalements: number;
  lastLogin: string | null;
  accountAge: number; // en jours
}

// ==================== CATALOGUE (Lot 5) ====================
// Superset des types publics : l'admin voit des champs jamais exposes a l'API publique
// (stripePriceId, deletedAt, timestamps), cf. admin:{subscription_plan,boost_offer}:read
// cote backend.
export interface AdminSubscriptionPlan extends SubscriptionPlan {
  stripePriceId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBoostOffer extends BoostOffer {
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanInput {
  code: string;
  name: string;
  priceAmountEur: string | null;
  priceAmountXaf: string | null;
  billingPeriod: string;
  maxActiveVoyages: number | null;
  maxActiveDemandes: number | null;
  hasBadge: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  stripePriceId: string | null;
}

export type UpdateSubscriptionPlanInput = Omit<CreateSubscriptionPlanInput, 'code'>;

export interface CreateBoostOfferInput {
  name: string;
  durationDays: number;
  priceAmountEur: string;
  priceAmountXaf: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export type UpdateBoostOfferInput = CreateBoostOfferInput;

// ==================== STATS REVENUS (Lot 5) ====================
export type RevenueByCurrency = Record<string, string>;

export interface AdminRevenueStats {
  totalByCurrency: RevenueByCurrency;
  thisMonthByCurrency: RevenueByCurrency;
  byType: Record<string, RevenueByCurrency>;
  byPaymentMethod: Record<PaymentMethod, RevenueByCurrency>;
  dailyRevenue: Array<{
    date: string;
    byCurrency: RevenueByCurrency;
  }>;
  transactionsSucceeded: number;
  transactionsFailed: number;
  tauxReussite: number;
}