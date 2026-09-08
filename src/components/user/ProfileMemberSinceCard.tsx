import { Calendar } from 'lucide-react';

import { Card } from '@/components/ui';
import { formatDate } from '@/lib/utils/format';

interface ProfileMemberSinceCardProps {
  createdAt: string;
}

export default function ProfileMemberSinceCard({ createdAt }: ProfileMemberSinceCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Membre depuis</span>
      </div>
      <p className="mt-2 font-semibold text-gray-900">
        {formatDate(createdAt)}
      </p>
    </Card>
  );
}
