'use client';

import { useRouter } from 'next/navigation';
import { Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button, Avatar, Badge } from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import type { User } from '@/types';

interface ProfileInfoCardProps {
  user: User;
}

export default function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const router = useRouter();
  const isOAuthUser = user.authProvider !== 'local';

  return (
    <div className="space-y-6">
      {/* Avatar et nom */}
      <div className="flex items-start gap-4">
        <Avatar
          src={user.photo}
          fallback={`${user.nom} ${user.prenom}`}
          size="xl"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {user.prenom} {user.nom}
          </h2>
          {user.bio && (
            <p className="text-gray-600 mt-2">{user.bio}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            {isOAuthUser && (
              <Badge className="bg-info/10 text-info">
                Connexion {user.authProvider}
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              Membre depuis {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Informations de contact */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{user.email}</span>
          {user.emailVerifie ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-warning" />
          )}
        </div>

        {user.telephone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">{user.telephone}</span>
            {user.telephoneVerifie ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-warning" />
            )}
          </div>
        )}
      </div>

      {/* Action sécurité */}
      <div className="pt-4 border-t border-gray-200">
        {isOAuthUser ? (
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <p className="text-sm text-info">
              <strong>Compte {user.authProvider}</strong> -
              La gestion du mot de passe se fait via {user.authProvider}.
            </p>
          </div>
        ) : (
          <Button
            variant="outline"
            leftIcon={<Shield className="w-4 h-4" />}
            onClick={() => router.push(ROUTES.AUTH_CHANGE_PASSWORD)}
            className="w-full sm:w-auto"
          >
            Changer le mot de passe
          </Button>
        )}
      </div>
    </div>
  );
}
