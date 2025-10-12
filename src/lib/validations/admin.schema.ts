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