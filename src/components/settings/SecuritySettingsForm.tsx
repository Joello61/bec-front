'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Bell, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { securitySettingsSchema, type SecuritySettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';

interface SecuritySettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function SecuritySettingsForm({ 
  settings, 
  onSubmit, 
  isLoading 
}: SecuritySettingsFormProps) {
  const { register, handleSubmit, formState: { isDirty }, watch } = useForm<SecuritySettingsFormData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactorEnabled: settings.twoFactorEnabled,
      loginNotifications: settings.loginNotifications,
    },
  });

  const twoFactorEnabled = watch('twoFactorEnabled');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Sécurité du compte
        </h3>

        {/* Authentification à deux facteurs */}
        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-primary cursor-pointer" 
              {...register('twoFactorEnabled')} 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <p className="font-medium text-gray-900">Authentification à deux facteurs (2FA)</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Ajoutez une couche de sécurité supplémentaire en activant la vérification en deux étapes
              </p>
            </div>
          </label>

          {twoFactorEnabled && (
            <div className="ml-8 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary-dark">
                <strong>Note :</strong> La 2FA sera configurée lors de votre prochaine connexion. Vous recevrez un code par SMS ou email.
              </p>
            </div>
          )}
        </div>

        {/* Notifications de connexion */}
        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-primary cursor-pointer" 
              {...register('loginNotifications')} 
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <p className="font-medium text-gray-900">Notifications de connexion</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Recevez une notification lors de chaque nouvelle connexion à votre compte
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Conseils de sécurité */}
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-warning-dark">Conseils de sécurité</p>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Utilisez un mot de passe fort et unique</li>
              <li>Ne partagez jamais vos identifiants</li>
              <li>Vérifiez régulièrement l&apos;activité de votre compte</li>
              <li>Déconnectez-vous sur les appareils partagés</li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={!isDirty || isLoading}
        className="w-full"
      >
        Enregistrer les modifications
      </Button>
    </form>
  );
}