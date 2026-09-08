import { Shield } from 'lucide-react';

import { Badge, Card } from '@/components/ui';
import type { User } from '@/types';

interface ProfileVerificationsCardProps {
  user: User;
}

export default function ProfileVerificationsCard({ user }: ProfileVerificationsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Vérifications
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Email</span>
          {user.emailVerifie ? (
            <Badge className="bg-success/10 text-success">
              Vérifié
            </Badge>
          ) : (
            <Badge className="bg-warning/10 text-warning">
              Non vérifié
            </Badge>
          )}
        </div>

        {user.telephone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Téléphone</span>
            {user.telephoneVerifie ? (
              <Badge className="bg-success/10 text-success">
                Vérifié
              </Badge>
            ) : (
              <Badge className="bg-warning/10 text-warning">
                Non vérifié
              </Badge>
            )}
          </div>
        )}

        {user.address && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Adresse</span>
            <Badge className="bg-success/10 text-success">
              Complétée
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
