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
      if (!date) return true;
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
  
  prixParKilo: z
    .number({
      error: 'Le prix par kilo doit être un nombre',
    })
    .positive('Le prix par kilo doit être positif')
    .max(100000, 'Le prix par kilo ne peut pas dépasser 100 000')
    .optional(),
  
  commissionProposeePourUnBagage: z
    .number({
      error: 'La commission doit être un nombre',
    })
    .positive('La commission doit être positive')
    .max(1000000, 'La commission ne peut pas dépasser 1 000 000')
    .optional(),
  
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
})
// ✅ NOUVEAU - Validation ville départ ≠ ville arrivée
.refine((data) => {
  return data.villeDepart.trim().toLowerCase() !== data.villeArrivee.trim().toLowerCase();
}, {
  message: 'La ville de départ et la ville d\'arrivée doivent être différentes',
  path: ['villeArrivee'],
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
  
  prixParKilo: z
    .number()
    .positive('Le prix par kilo doit être positif')
    .max(100000, 'Le prix par kilo ne peut pas dépasser 100 000')
    .optional(),
  
  commissionProposeePourUnBagage: z
    .number()
    .positive('La commission doit être positive')
    .max(1000000, 'La commission ne peut pas dépasser 1 000 000')
    .optional(),
  
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
})
// ✅ NOUVEAU - Validation ville départ ≠ ville arrivée pour update
.refine((data) => {
  if (data.villeDepart && data.villeArrivee) {
    return data.villeDepart.trim().toLowerCase() !== data.villeArrivee.trim().toLowerCase();
  }
  return true;
}, {
  message: 'La ville de départ et la ville d\'arrivée doivent être différentes',
  path: ['villeArrivee'],
});

export const demandeFiltersSchema = z.object({
  villeDepart: z.string().optional(),
  villeArrivee: z.string().optional(),
  statut: z.enum(['en_recherche', 'voyageur_trouve', 'annulee']).optional(),
});

export type CreateDemandeFormData = z.infer<typeof createDemandeSchema>;
export type UpdateDemandeFormData = z.infer<typeof updateDemandeSchema>;
export type DemandeFiltersFormData = z.infer<typeof demandeFiltersSchema>;