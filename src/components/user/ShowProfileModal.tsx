'use client';

import { User } from '@/types';
import { Modal, Avatar } from '../ui';
import { Check } from 'lucide-react';

export interface ShowProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ShowProfileModal({
  isOpen,
  onClose,
  user
}: ShowProfileModalProps) {
  if (!user) return null;

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-base text-gray-900">{value}</span>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profil utilisateur"
      size="md"
    >
      <div className="space-y-6">
        {/* Avatar et nom */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar
            src={user.photo}
            alt={`${user.prenom} ${user.nom}`}
            fallback={`${user.prenom} ${user.nom}`}
            size="xl"
            verified={user.emailVerifie && user.telephoneVerifie}
          />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Badges de vérification */}
        <div className="flex items-center justify-center gap-2">
          {user.emailVerifie && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
              <Check className="w-4 h-4" strokeWidth={3}/>
              Email vérifié
            </span>
          )}
          {user.telephoneVerifie && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-info/10 text-info">
              <Check className="w-4 h-4" strokeWidth={3}/>
              Téléphone vérifié
            </span>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <InfoRow label="Téléphone" value={user.telephone} />
          <InfoRow label="Bio" value={user.bio} />
          
          {user.address && (
            <>
              <InfoRow label="Pays" value={user.address.pays} />
              <InfoRow label="Ville" value={user.address.ville} />
              <InfoRow label="Quartier" value={user.address.quartier} />
              <InfoRow label="Adresse" value={user.address.adresseLigne1} />
              <InfoRow label="Code postal" value={user.address.codePostal} />
            </>
          )}
        </div>

        {/* Date d'inscription */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400 text-center">
            Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </Modal>
  );
}