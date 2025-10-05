/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Edit2, 
  CheckCircle, 
  XCircle,
  Star,
  Package,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { usersApi } from '@/lib/api/users';
import { ProfileForm } from '@/components/forms';
import { Button, Avatar, Badge, Card } from '@/components/ui';
import { LoadingSpinner, ErrorState, useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import { formatDate } from '@/lib/utils/format';
import type { UpdateUserFormData } from '@/lib/validations';
import type { DashboardData } from '@/types';

export default function ProfilePage() {
  const { user, fetchMe } = useAuth();
  const router = useRouter();
  const toast = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await usersApi.dashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
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
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Chargement du profil..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }

  if (!user) return null;

  const isOAuthUser = user.authProvider !== 'local';

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
              )}
            </Card>
          </motion.div>
        </div>

        {/* Colonne droite - Statistiques */}
        <div className="space-y-6">
          {/* Stats rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Statistiques
              </h3>

              <div className="space-y-4">
                {/* Voyages */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Voyages</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {stats?.voyages.total || 0}
                  </span>
                </div>

                {/* Demandes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Demandes</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {stats?.demandes.total || 0}
                  </span>
                </div>

                {/* Note moyenne - toujours afficher */}
                {stats?.stats !== undefined && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${stats.stats.nombreAvis > 0 ? 'text-warning' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600">Note moyenne</span>
                    </div>
                    {stats.stats.nombreAvis > 0 ? (
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">
                        {stats.stats.noteMoyenne.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                        ({stats.stats.nombreAvis} avis)
                        </span>
                    </div>
                    ) : (
                    <span className="text-sm text-gray-500">
                        Aucun avis
                    </span>
                    )}
                </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Vérifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
              </div>
            </Card>
          </motion.div>

          {/* Compte créé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Membre depuis</span>
              </div>
              <p className="mt-2 font-semibold text-gray-900">
                {formatDate(user.createdAt)}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}