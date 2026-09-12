import { Eye, Lock } from 'lucide-react';
import Link from 'next/link';

interface ViewsStatCardProps {
  nombreVues?: number;
  nombreVuesLocked?: boolean;
}

/**
 * Compteur de vues (Lot 6.2) - avantage differenciant des plans payants. Rendu
 * uniquement si le backend a injecte nombreVues (proprietaire eligible) ou
 * nombreVuesLocked (proprietaire non eligible, upsell) - jamais pour un tiers, qui ne
 * recoit ni l'un ni l'autre champ dans la reponse.
 */
export default function ViewsStatCard({ nombreVues, nombreVuesLocked }: ViewsStatCardProps) {
  if (nombreVuesLocked) {
    return (
      <div className="flex items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Statistiques de vues verrouillées</p>
            <p className="text-xs text-gray-500">Passez à un plan supérieur pour voir qui consulte vos annonces</p>
          </div>
        </div>
        <Link
          href="/dashboard/settings/subscription"
          className="text-sm font-medium text-primary hover:text-primary-dark whitespace-nowrap"
        >
          Voir les plans
        </Link>
      </div>
    );
  }

  if (nombreVues === undefined) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Eye className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">
          {nombreVues} vue{nombreVues > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-gray-500">Nombre de fois où cette annonce a été consultée</p>
      </div>
    </div>
  );
}
