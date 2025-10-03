import { z } from 'zod';

export const createVoyageSchema = z.object({
  villeDepart: z
    .string()
    .min(1, 'La ville de départ est requise')
    .min(2, 'La ville de départ doit contenir au moins 2 caractères')
    .max(100, 'La ville de départ ne peut pas dépasser 100 caractères'),
  villeArrivee: z
    .string()
    .min(1, 'La ville d\'arrivée est requise')
    .min(2, 'La ville d\'arrivée doit contenir au moins 2 caractères')
    .max(100, 'La ville d\'arrivée ne peut pas dépasser 100 caractères'),
  dateDepart: z
    .string()
    .min(1, 'La date de départ est requise')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date de départ ne peut pas être dans le passé'),
  dateArrivee: z
    .string()
    .min(1, 'La date d\'arrivée est requise'),
  poidsDisponible: z
    .number({
        error: 'Le poids doit être un nombre',
    })
    .min(1, 'Le poids doit être d\'au moins 1 kg')
    .max(100, 'Le poids ne peut pas dépasser 100 kg'),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
}).refine((data) => {
  const depart = new Date(data.dateDepart);
  const arrivee = new Date(data.dateArrivee);
  return arrivee > depart;
}, {
  message: 'La date d\'arrivée doit être après la date de départ',
  path: ['dateArrivee'],
});

export const updateVoyageSchema = z.object({
  villeDepart: z
    .string()
    .min(2, 'La ville de départ doit contenir au moins 2 caractères')
    .max(100, 'La ville de départ ne peut pas dépasser 100 caractères')
    .optional(),
  villeArrivee: z
    .string()
    .min(2, 'La ville d\'arrivée doit contenir au moins 2 caractères')
    .max(100, 'La ville d\'arrivée ne peut pas dépasser 100 caractères')
    .optional(),
  dateDepart: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date de départ ne peut pas être dans le passé')
    .optional(),
  dateArrivee: z
    .string()
    .optional(),
  poidsDisponible: z
    .number()
    .min(1, 'Le poids doit être d\'au moins 1 kg')
    .max(100, 'Le poids ne peut pas dépasser 100 kg')
    .optional(),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
});

export const voyageFiltersSchema = z.object({
  villeDepart: z.string().optional(),
  villeArrivee: z.string().optional(),
  dateDepart: z.string().optional(),
  statut: z.enum(['actif', 'complet', 'termine', 'annule']).optional(),
});

export type CreateVoyageFormData = z.infer<typeof createVoyageSchema>;
export type UpdateVoyageFormData = z.infer<typeof updateVoyageSchema>;
export type VoyageFiltersFormData = z.infer<typeof voyageFiltersSchema>;