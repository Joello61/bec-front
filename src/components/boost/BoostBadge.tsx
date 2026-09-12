import { Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui';

interface BoostBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function BoostBadge({ size = 'md' }: BoostBadgeProps) {
  return (
    <Badge variant="warning" size={size}>
      <Sparkles className="w-3 h-3 mr-1 inline" />
      Boosté
    </Badge>
  );
}
