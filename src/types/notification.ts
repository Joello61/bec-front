export type AppNotificationType = 
  | 'matching_voyage' 
  | 'matching_demande' 
  | 'new_message' 
  | 'avis_recu' 
  | 'voyage_statut' 
  | 'demande_statut'
  | 'new_proposition';

export interface AppNotification {
  id: number;
  type: AppNotificationType;
  titre: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | null;
  lue: boolean;
  createdAt: string;
}