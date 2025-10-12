'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Ban,
  ShieldOff,
  Settings,
  Plane,
  Package,
  MessageSquare,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import type { User, AdminUserActivity, AdminLog } from '@/types';
import { cn } from '@/lib/utils/cn';

interface UserDetailsCardProps {
  user: User;
  activity: AdminUserActivity | null;
  adminLogs: AdminLog[];
  onBan: () => void;
  onUpdateRoles: () => void;
  onDelete: () => void;
}

export default function UserDetailsCard({
  user,
  activity,
  adminLogs,
  onBan,
  onUpdateRoles,
  onDelete,
}: UserDetailsCardProps) {
  const isAdmin = user.roles.includes('ROLE_ADMIN');
  const isModerator = user.roles.includes('ROLE_MODERATOR');

  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">
                {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.prenom} {user.nom}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Status Badge */}
          {user.isBanned ? (
            <Badge variant="error" size="lg">
              <ShieldAlert className="w-4 h-4" />
              Banni
            </Badge>
          ) : (
            <Badge variant="success" size="lg">
              <ShieldCheck className="w-4 h-4" />
              Actif
            </Badge>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InfoItem icon={Mail} label="Email" value={user.email} verified={user.emailVerifie} />
          <InfoItem
            icon={Phone}
            label="Téléphone"
            value={user.telephone || 'Non renseigné'}
            verified={user.telephoneVerifie}
          />
          <InfoItem
            icon={Calendar}
            label="Inscrit le"
            value={format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: fr })}
          />
          <InfoItem
            icon={Shield}
            label="Rôles"
            value={
              <div className="flex gap-2">
                {isAdmin && <Badge variant="error">Admin</Badge>}
                {isModerator && <Badge variant="warning">Modérateur</Badge>}
                {!isAdmin && !isModerator && <Badge>Utilisateur</Badge>}
              </div>
            }
          />
        </div>

        {/* Ban Info */}
        {user.isBanned && user.bannedAt && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-900 mb-2">
              Informations sur le bannissement
            </h3>
            <div className="space-y-1 text-sm text-red-800">
              <p>
                <strong>Date :</strong>{' '}
                {format(new Date(user.bannedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
              <p>
                <strong>Raison :</strong> {user.banReason || 'Non spécifiée'}
              </p>
              {user.bannedBy && (
                <p>
                  <strong>Par :</strong> {user.bannedBy.prenom} {user.bannedBy.nom}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onUpdateRoles}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Settings className="w-4 h-4" />
            Modifier les rôles
          </button>

          {user.isBanned ? (
            <button
              onClick={onBan}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
            >
              <ShieldOff className="w-4 h-4" />
              Débannir
            </button>
          ) : (
            <button
              onClick={onBan}
              className="flex items-center gap-2 px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors"
            >
              <Ban className="w-4 h-4" />
              Bannir
            </button>
          )}

          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer le compte
          </button>
        </div>
      </div>

      {/* Activity Stats */}
      {activity && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité de l&apos;utilisateur
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem
              icon={Plane}
              label="Voyages"
              value={activity.voyages.length}
              color="primary"
            />
            <StatItem
              icon={Package}
              label="Demandes"
              value={activity.demandes.length}
              color="secondary"
            />
            <StatItem
              icon={MessageSquare}
              label="Messages"
              value={activity.messagesCount}
              color="info"
            />
            <StatItem
              icon={Star}
              label="Avis"
              value={activity.avisCount}
              color="warning"
            />
          </div>
        </div>
      )}

      {/* Admin Logs */}
      {adminLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Historique administratif ({adminLogs.length})
          </h3>
          <div className="space-y-3">
            {adminLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Par {log.admin.prenom} {log.admin.nom} •{' '}
                    {format(new Date(log.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function InfoItem({
  icon: Icon,
  label,
  value,
  verified,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: React.ReactNode;
  verified?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-medium text-gray-900">{value}</p>
          {verified !== undefined && (
            <span
              className={cn(
                'text-xs font-semibold',
                verified ? 'text-success' : 'text-gray-400'
              )}
            >
              {verified ? '✓ Vérifié' : '✗ Non vérifié'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <Icon className={cn('w-6 h-6 mx-auto mb-2', `text-${color}`)} />
      <p className={cn('text-2xl font-bold', `text-${color}`)}>{value}</p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
}