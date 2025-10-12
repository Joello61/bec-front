'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { UserDetailsCard, BanUserModal, UpdateRolesModal, DeleteUserModal } from '@/components/admin';

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);

  const [showBanModal, setShowBanModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    currentUser,
    userActivity,
    userAdminLogs,
    isLoading,
    error,
    fetchUserDetails,
    fetchUserActivity,
    fetchUserAdminLogs,
  } = useAdmin();

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
      fetchUserActivity(userId);
      fetchUserAdminLogs(userId);
    }
  }, [userId, fetchUserDetails, fetchUserActivity, fetchUserAdminLogs]);

  if (isLoading && !currentUser) {
    return <LoadingSpinner fullScreen text="Chargement des détails..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push(ROUTES.ADMIN_USERS)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(ROUTES.ADMIN_USERS)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser.prenom} {currentUser.nom}
          </h1>
          <p className="text-gray-500 mt-1">{currentUser.email}</p>
        </div>
      </div>

      {/* User Details */}
      <UserDetailsCard
        user={currentUser}
        activity={userActivity}
        adminLogs={userAdminLogs}
        onBan={() => setShowBanModal(true)}
        onUpdateRoles={() => setShowRolesModal(true)}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Modals */}
      {showBanModal && (
        <BanUserModal
          user={currentUser}
          onClose={() => setShowBanModal(false)}
          onSuccess={() => {
            setShowBanModal(false);
            fetchUserDetails(userId);
          }}
        />
      )}

      {showRolesModal && (
        <UpdateRolesModal
          user={currentUser}
          onClose={() => setShowRolesModal(false)}
          onSuccess={() => {
            setShowRolesModal(false);
            fetchUserDetails(userId);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteUserModal
          user={currentUser}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false);
            router.push(ROUTES.ADMIN_USERS);
          }}
        />
      )}
    </div>
  );
}