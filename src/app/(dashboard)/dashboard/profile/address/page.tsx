/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useAuth, useAddress } from '@/lib/hooks';
import AddressForm from '@/components/forms/AddressForm';
import AddressCard from '@/components/user/AddressCard';
import { Button, Card } from '@/components/ui';
import { LoadingSpinner, ErrorState, useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import type { UpdateAddressFormData } from '@/lib/validations/address.schema';

export default function AddressPage() {
  const router = useRouter();
  const { user, fetchMe } = useAuth();
  const { modificationInfo, isLoading, error, fetchModificationInfo, updateAddress } = useAddress();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchModificationInfo();
  }, [fetchModificationInfo]);

  const handleUpdateAddress = async (data: UpdateAddressFormData) => {
    try {
      await updateAddress(data);
      await fetchMe();
      toast.success('Adresse mise à jour avec succès !');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Chargement..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchModificationInfo} />;
  }

  if (!user?.address) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune adresse enregistrée
          </h2>
          <p className="text-gray-600 mb-4">
            Vous devez d&apos;abord compléter votre profil pour ajouter une adresse.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.COMPLETE_PROFILE)}
          >
            Compléter mon profil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(ROUTES.PROFILE)}
          className="mb-4"
        >
          Retour au profil
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-lg">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon adresse</h1>
            <p className="text-gray-600 mt-1">
              Gérez votre adresse de résidence
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          {isEditing ? (
            <AddressForm
              address={user.address}
              canModify={modificationInfo?.canModify ?? true}
              daysRemaining={modificationInfo?.daysRemaining}
              nextModificationDate={modificationInfo?.nextModificationDate ?? undefined}
              onSubmit={handleUpdateAddress}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <AddressCard
              address={user.address}
              canModify={modificationInfo?.canModify ?? true}
              nextModificationDate={modificationInfo?.nextModificationDate}
              onEdit={() => setIsEditing(true)}
              showEditButton={true}
            />
          )}
        </Card>
      </motion.div>

      {/* Info contrainte 6 mois */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              Pourquoi cette restriction ?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Sécurité : Éviter les changements fréquents suspects</li>
              <li>• Conformité : Respecter les réglementations en vigueur</li>
              <li>• Fiabilité : Garantir des informations stables pour les transactions</li>
            </ul>
          </Card>
        </motion.div>
      )}
    </div>
  );
}