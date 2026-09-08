'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Edit2, ChevronRight } from 'lucide-react';
import { useAddress, useAuth } from '@/lib/hooks';
import { usersApi } from '@/lib/api/users';
import { ProfileForm } from '@/components/forms';
import AddressCard from '@/components/user/AddressCard';
import ProfileInfoCard from '@/components/user/ProfileInfoCard';
import ProfileStatsCard from '@/components/user/ProfileStatsCard';
import ProfileVerificationsCard from '@/components/user/ProfileVerificationsCard';
import ProfileMemberSinceCard from '@/components/user/ProfileMemberSinceCard';
import { Button, Card } from '@/components/ui';
import { LoadingSpinner, ErrorState, useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import type { UpdateUserFormData } from '@/lib/validations';
import type { ApiError, DashboardData } from '@/types';

// L'intercepteur axios (lib/api/client.ts) rejette toujours avec un objet
// simple {success, message, ...} - jamais une instance Error - donc
// `err instanceof Error` ne detecterait jamais ce cas.
function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as Partial<ApiError>).message === 'string') {
    return (err as ApiError).message;
  }
  return fallback;
}

export default function ProfilePageClient() {
  const { user, fetchMe } = useAuth();
  const router = useRouter();
  const toast = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { modificationInfo } = useAddress();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await usersApi.dashboard();
      setStats(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du chargement'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateUserFormData) => {
    try {
      await usersApi.updateMe(data);
      await fetchMe();
      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erreur lors de la mise à jour'));
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Chargement du profil..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles
          </p>
        </div>
        
        {!isEditing && (
          <Button
            variant="primary"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Infos principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              {isEditing ? (
                <ProfileForm
                  user={user}
                  onSubmit={handleUpdateProfile}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <ProfileInfoCard user={user} />
              )}
            </Card>
          </motion.div>

          {/* ==================== NOUVELLE SECTION : ADRESSE ==================== */}
          {!isEditing && user.address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Mon adresse</h2>
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  onClick={() => router.push(ROUTES.PROFILE_ADDRESS)}
                >
                  Gérer
                </Button>
              </div>
              <AddressCard
                address={user.address}
                canModify={modificationInfo?.canModify ?? true}
                nextModificationDate={modificationInfo?.nextModificationDate}
                showEditButton={false}
              />
            </motion.div>
          )}
        </div>

        {/* Colonne droite - Statistiques */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProfileStatsCard stats={stats} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProfileVerificationsCard user={user} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ProfileMemberSinceCard createdAt={user.createdAt} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}