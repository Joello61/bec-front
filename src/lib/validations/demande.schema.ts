import { z } from 'zod';

export const createDemandeSchema = z.object({
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
  dateLimite: z
    .string()
    .refine((date) => {
      if (!date) return true; // Optional
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date limite ne peut pas être dans le passé')
    .optional(),
  poidsEstime: z
    .number({
        error: 'Le poids doit être un nombre',
    })
    .min(0.1, 'Le poids doit être d\'au moins 0.1 kg')
    .max(50, 'Le poids ne peut pas dépasser 50 kg'),
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
});

export const updateDemandeSchema = z.object({
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
  dateLimite: z
    .string()
    .refine((date) => {
      if (!date) return true;
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date limite ne peut pas être dans le passé')
    .optional(),
  poidsEstime: z
    .number()
    .min(0.1, 'Le poids doit être d\'au moins 0.1 kg')
    .max(50, 'Le poids ne peut pas dépasser 50 kg')
    .optional(),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
});

export const demandeFiltersSchema = z.object({
  villeDepart: z.string().optional(),
  villeArrivee: z.string().optional(),
  statut: z.enum(['en_recherche', 'voyageur_trouve', 'annulee']).optional(),
});

export type CreateDemandeFormData = z.infer<typeof createDemandeSchema>;
export type UpdateDemandeFormData = z.infer<typeof updateDemandeSchema>;
export type DemandeFiltersFormData = z.infer<typeof demandeFiltersSchema>;