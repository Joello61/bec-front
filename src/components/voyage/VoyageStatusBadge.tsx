import { Badge } from '@/components/ui';
import type { VoyageStatut } from '@/types';

interface VoyageStatusBadgeProps {
  statut: VoyageStatut;
  size?: 'sm' | 'md' | 'lg';
}

export default function VoyageStatusBadge({ statut, size = 'md' }: VoyageStatusBadgeProps) {
  const statusConfig = {
    actif: { variant: 'success' as const, label: 'Actif', dot: true },
    complete: { variant: 'warning' as const, label: 'Complet', dot: false },
    en_cours: { variant: 'neutral' as const, label: 'Terminé', dot: false },
    annule: { variant: 'error' as const, label: 'Annulé', dot: false },
  };

  const config = statusConfig[statut];

  return (
    <Badge variant={config.variant} size={size} dot={config.dot}>
      {config.label}
    </Badge>
  );
}