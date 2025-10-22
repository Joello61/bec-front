'use client';

import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { PropositionStatut } from '@/types';

interface PropositionStatusBadgeProps {
  statut: PropositionStatut;
  className?: string;
}

export function PropositionStatusBadge({ statut, className }: PropositionStatusBadgeProps) {
  const config = {
    en_attente: {
      label: 'En attente',
      icon: Clock,
      className: 'bg-warning/10 text-warning border-warning/20',
    },
    acceptee: {
      label: 'Acceptée',
      icon: CheckCircle,
      className: 'bg-success/10 text-success border-success/20',
    },
    refusee: {
      label: 'Refusée',
      icon: XCircle,
      className: 'bg-error/10 text-error border-error/20',
    },
    annulee: {
      label: 'Annulée',
      icon: XCircle,
      className: 'bg-error/10 text-error border-error/20',
    },
  };

  const { label, icon: Icon, className: statusClass } = config[statut];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
        statusClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}