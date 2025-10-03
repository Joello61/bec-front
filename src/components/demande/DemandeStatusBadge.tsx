import { Badge } from '@/components/ui';
import type { DemandeStatut } from '@/types';

interface DemandeStatusBadgeProps {
  statut: DemandeStatut;
  size?: 'sm' | 'md' | 'lg';
}

export default function DemandeStatusBadge({ statut, size = 'md' }: DemandeStatusBadgeProps) {
  const statusConfig = {
    en_recherche: { variant: 'info' as const, label: 'En recherche', dot: true },
    voyageur_trouve: { variant: 'success' as const, label: 'Voyageur trouvé', dot: false },
    annulee: { variant: 'error' as const, label: 'Annulée', dot: false },
  };

  const config = statusConfig[statut];

  return (
    <Badge variant={config.variant} size={size} dot={config.dot}>
      {config.label}
    </Badge>
  );
}