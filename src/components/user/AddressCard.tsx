'use client';

import { MapPin, Home, Building2, Mail as MailIcon, Edit2, Calendar } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import type { Address } from '@/types/address';
import { formatDate } from '@/lib/utils/format';

interface AddressCardProps {
  address: Address;
  canModify: boolean;
  nextModificationDate?: string | null;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function AddressCard({ 
  address, 
  canModify,
  nextModificationDate,
  onEdit,
  showEditButton = true 
}: AddressCardProps) {
  const addressType = address.quartier ? 'african' : 'postal';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mon adresse</h3>
          <p className="text-sm text-gray-600">
            {addressType === 'african' ? 'Format Afrique' : 'Format International'}
          </p>
        </div>
        {showEditButton && onEdit && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={onEdit}
            disabled={!canModify}
          >
            Modifier
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {/* Pays */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Pays</p>
            <p className="font-medium text-gray-900">{address.pays}</p>
          </div>
        </div>

        {/* Ville */}
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Ville</p>
            <p className="font-medium text-gray-900">{address.ville}</p>
          </div>
        </div>

        {/* Format Afrique - Quartier */}
        {address.quartier && (
          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Quartier</p>
              <p className="font-medium text-gray-900">{address.quartier}</p>
            </div>
          </div>
        )}

        {/* Format Diaspora - Adresse complète */}
        {address.adresseLigne1 && (
          <>
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-medium text-gray-900">{address.adresseLigne1}</p>
                {address.adresseLigne2 && (
                  <p className="font-medium text-gray-900">{address.adresseLigne2}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MailIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Code postal</p>
                <p className="font-medium text-gray-900">{address.codePostal}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Informations de modification */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {address.lastModifiedAt ? (
            <span>
              Dernière modification : {formatDate(address.lastModifiedAt)}
            </span>
          ) : (
            <span>Jamais modifiée</span>
          )}
        </div>

        {!canModify && nextModificationDate && (
          <div className="mt-2">
            <Badge className="bg-warning/10 text-warning">
              Prochaine modification possible le {new Date(nextModificationDate).toLocaleDateString('fr-FR')}
            </Badge>
          </div>
        )}

        {canModify && (
          <div className="mt-2">
            <Badge className="bg-success/10 text-success">
              Modification autorisée
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}