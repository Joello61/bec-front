import { z } from 'zod';

// Schéma pour créer une proposition
export const createPropositionSchema = z.object({
  demandeId: z
    .number({
      error: 'L\'ID de la demande est requis et doit être un nombre',
    })
    .int('L\'ID de la demande doit être un entier')
    .positive('L\'ID de la demande doit être positif'),

  prixParKilo: z
    .number({
        error: 'Le prix par kilo est requis et doit être un nombre',
    })
    .positive('Le prix par kilo doit être positif')
    .max(100000, 'Le prix par kilo ne peut pas dépasser 100 000'),

  commissionProposeePourUnBagage: z
    .number({
        error: 'La commission est requise et doit être un nombre',
    })
    .positive('La commission doit être positive')
    .max(1000000, 'La commission ne peut pas dépasser 1 000 000'),

  message: z
    .string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional(),
});

// Schéma pour répondre à une proposition
export const respondPropositionSchema = z.object({
  action: z.enum(['accepter', 'refuser']).refine((val) => !!val, {
    message: "L'action est requise",
  }),

  messageRefus: z
    .string()
    .max(500, 'Le message de refus ne peut pas dépasser 500 caractères')
    .optional()
    .refine(
      (val) => val === undefined || val.trim().length > 0,
      'Le message de refus ne peut pas être vide'
    ),
}).refine(
  () => {
    // Si l'action est "refuser", le message de refus devrait être fourni (optionnel mais recommandé)
    return true;
  },
  {
    message: 'Un message de refus est recommandé',
  }
);

// Types inférés
export type CreatePropositionFormData = z.infer<typeof createPropositionSchema>;
export type RespondPropositionFormData = z.infer<typeof respondPropositionSchema>;