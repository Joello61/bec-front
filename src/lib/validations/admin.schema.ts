import { z } from 'zod';

// ==================== BAN USER ====================
export const banUserSchema = z.object({
  reason: z
    .string()
    .min(10, 'La raison doit contenir au moins 10 caractères')
    .max(500, 'La raison ne peut pas dépasser 500 caractères'),
  type: z.enum(['permanent', 'temporary'], {
    message: 'Type invalide',
  }),
  bannedUntil: z.string().optional(),
  notifyUser: z.boolean(),
  deleteContent: z.boolean(),
}).refine(
  (data) => {
    // Si type=temporary, bannedUntil est obligatoire
    if (data.type === 'temporary' && !data.bannedUntil) {
      return false;
    }
    return true;
  },
  {
    message: 'La date de fin est obligatoire pour un bannissement temporaire',
    path: ['bannedUntil'],
  }
);

export type BanUserFormData = z.infer<typeof banUserSchema>;

// ==================== UPDATE ROLES ====================
export const updateRolesSchema = z.object({
  roles: z
    .array(z.string())
    .min(1, 'Au moins un rôle est requis')
    .refine(
      (roles) => roles.includes('ROLE_USER'),
      'ROLE_USER est obligatoire pour tous les utilisateurs'
    )
    .refine(
      (roles) => {
        // Un utilisateur ne peut pas avoir ROLE_ADMIN et ROLE_MODERATOR en même temps
        const hasAdmin = roles.includes('ROLE_ADMIN');
        const hasModerator = roles.includes('ROLE_MODERATOR');
        return !(hasAdmin && hasModerator);
      },
      'Un utilisateur ne peut pas être admin et modérateur en même temps'
    ),
  reason: z.string().max(500).optional(),
  notifyUser: z.boolean(),
});

export type UpdateRolesFormData = z.infer<typeof updateRolesSchema>;

// ==================== DELETE CONTENT ====================
export const deleteContentSchema = z.object({
  reason: z
    .string()
    .min(10, 'La raison doit contenir au moins 10 caractères')
    .max(500, 'La raison ne peut pas dépasser 500 caractères'),
  motif: z.enum(['spam', 'fraude', 'harcelement', 'contenu_inapproprie', 'autre'], {
    message: 'Motif invalide',
  }),
  notifyUser: z.boolean(),
  banUser: z.boolean(),
  banReason: z.string().max(500).optional(),
  deleteAllUserContent: z.boolean(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  internalNotes: z.string().max(1000).optional(),
}).refine(
  (data) => {
    // Si banUser=true, banReason est obligatoire
    if (data.banUser && !data.banReason) {
      return false;
    }
    return true;
  },
  {
    message: "La raison du bannissement est obligatoire si vous bannissez l'utilisateur",
    path: ['banReason'],
  }
);

export type DeleteContentFormData = z.infer<typeof deleteContentSchema>;

// ==================== LOG FILTERS ====================
export const logFiltersSchema = z.object({
  action: z.string().optional(),
  targetType: z.string().optional(),
  adminId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type LogFiltersFormData = z.infer<typeof logFiltersSchema>;

// ==================== USER FILTERS ====================
export const userFiltersSchema = z.object({
  role: z.string().optional(),
  banned: z.boolean().optional(),
  verified: z.boolean().optional(),
  search: z.string().optional(),
});

export type UserFiltersFormData = z.infer<typeof userFiltersSchema>;

// ==================== CATALOGUE : PLAN D'ABONNEMENT (Lot 5) ====================
export const subscriptionPlanSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code est obligatoire')
    .max(30, 'Le code ne peut pas dépasser 30 caractères')
    .regex(/^[a-z0-9_-]+$/, 'Minuscules, chiffres, tirets et underscores uniquement'),
  name: z.string().min(1, 'Le nom est obligatoire').max(100),
  priceAmountEur: z.string().nullable(),
  priceAmountXaf: z.string().nullable(),
  billingPeriod: z.literal('monthly'),
  maxActiveVoyages: z.number().int().positive().nullable(),
  maxActiveDemandes: z.number().int().positive().nullable(),
  hasBadge: z.boolean(),
  hasViewStats: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  stripePriceId: z.string().nullable(),
});

export type SubscriptionPlanFormData = z.infer<typeof subscriptionPlanSchema>;

// ==================== CATALOGUE : OFFRE DE BOOST (Lot 5) ====================
export const boostOfferSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire').max(100),
  durationDays: z.number().int().positive('La durée doit être positive'),
  priceAmountEur: z.string().min(1, 'Le prix EUR est obligatoire'),
  priceAmountXaf: z.string().nullable(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export type BoostOfferFormData = z.infer<typeof boostOfferSchema>;

// ==================== REMBOURSEMENT TRANSACTION (Lot 6.1) ====================
export const refundTransactionSchema = z.object({
  reason: z.string().max(500, 'La raison ne peut pas dépasser 500 caractères').optional(),
});

export type RefundTransactionFormData = z.infer<typeof refundTransactionSchema>;