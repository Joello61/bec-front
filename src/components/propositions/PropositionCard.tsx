'use client';

import type { Proposition } from '@/types';

import PropositionCardDesktop from './PropositionCardDesktop';
import PropositionCardMobile from './PropositionCardMobile';

interface PropositionCardProps {
  proposition: Proposition;
  viewMode: 'sent' | 'received';
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onViewVoyageDetails?: (idVoyage: number) => void;
  onViewPropositionDetails?: (idProposition: number) => void;
}

export default function PropositionCard({
  proposition,
  viewMode,
  onAccept,
  onRefuse,
  onViewVoyageDetails,
  onViewPropositionDetails
}: PropositionCardProps) {
  const isReceived = viewMode === 'received';
  const isPending = proposition.statut === 'en_attente';
  const otherUser = isReceived ? proposition.client : proposition.voyageur;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-200">
      <PropositionCardMobile
        proposition={proposition}
        otherUser={otherUser}
        isReceived={isReceived}
        isPending={isPending}
        onAccept={onAccept}
        onRefuse={onRefuse}
        onViewVoyageDetails={onViewVoyageDetails}
        onViewPropositionDetails={onViewPropositionDetails}
      />
      <PropositionCardDesktop
        proposition={proposition}
        otherUser={otherUser}
        isReceived={isReceived}
        isPending={isPending}
        onAccept={onAccept}
        onRefuse={onRefuse}
        onViewVoyageDetails={onViewVoyageDetails}
        onViewPropositionDetails={onViewPropositionDetails}
      />
    </div>
  );
}
