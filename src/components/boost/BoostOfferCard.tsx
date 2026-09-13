import { Rocket, Sparkles } from 'lucide-react';

import { Badge, Card } from '@/components/ui';
import type { BoostOffer } from '@/types';

interface BoostOfferCardProps {
  offer: BoostOffer;
  formatAmount: (amount: string, currency: string) => string;
}

/**
 * Carte d'affichage d'une offre de boost - aucun composant equivalent n'existait avant
 * la page pricing publique (Lot N2, plan-complements-monetisation-cobage.md), les offres
 * de boost n'etant jusque-la affichees que dans la modal de checkout sur une ressource
 * possedee. Purement presentationnel, aucun CTA propre : booster une annonce suppose
 * d'en posseder une (voir BoostButton, deja place au bon endroit sur le detail voyage/
 * demande), pas une action disponible depuis une page publique.
 */
export default function BoostOfferCard({ offer, formatAmount }: BoostOfferCardProps) {
  return (
    <Card variant="bordered" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-gray-900">{offer.name}</h3>
        </div>
        {offer.isFeatured && (
          <Badge variant="warning">
            <Sparkles className="w-3 h-3 mr-1 inline" />
            Populaire
          </Badge>
        )}
      </div>

      <p className="text-sm text-gray-600">
        {offer.durationDays} jour{offer.durationDays > 1 ? 's' : ''} de visibilité renforcée
      </p>

      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900">{formatAmount(offer.priceAmountEur, 'EUR')}</p>
        {offer.priceAmountXaf && (
          <p className="text-sm text-gray-500">({formatAmount(offer.priceAmountXaf, 'XAF')})</p>
        )}
      </div>
    </Card>
  );
}
