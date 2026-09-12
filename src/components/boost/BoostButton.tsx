'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import type { BoostTargetType } from '@/types';

import BoostModal from './BoostModal';

interface BoostButtonProps {
  targetType: BoostTargetType;
  targetId: number;
}

export default function BoostButton({ targetType, targetId }: BoostButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowModal(true)}>
        <Sparkles className="w-4 h-4 mr-2" />
        Booster la visibilité
      </Button>

      {showModal && (
        <BoostModal targetType={targetType} targetId={targetId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
