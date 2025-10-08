'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Eye, Phone, Mail, BarChart } from 'lucide-react';
import { Button } from '@/components/ui';
import { privacySettingsSchema, type PrivacySettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';

interface PrivacySettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function PrivacySettingsForm({ 
  settings, 
  onSubmit, 
  isLoading 
}: PrivacySettingsFormProps) {
  const { register, handleSubmit, formState: { isDirty }, watch } = useForm<PrivacySettingsFormData>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: settings.profileVisibility,
      showPhone: settings.showPhone,
      showEmail: settings.showEmail,
      showStats: settings.showStats,
      messagePermission: settings.messagePermission,
      showInSearchResults: settings.showInSearchResults,
      showLastSeen: settings.showLastSeen,
    },
  });

  const profileVisibility = watch('profileVisibility');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Visibilité du profil */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Visibilité du profil
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input 
              type="radio" 
              value="public" 
              className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
              {...register('profileVisibility')} 
            />
            <div>
              <p className="font-medium text-gray-900">Public</p>
              <p className="text-sm text-gray-600">Vitextsible par tous les utilisateurs</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input 
              type="radio" 
              value="verified_only" 
              className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
              {...register('profileVisibility')} 
            />
            <div>
              <p className="font-medium text-gray-900">Utilisateurs vérifiés uniquement</p>
              <p className="text-sm text-gray-600">Visible seulement par les utilisateurs vérifiés</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input 
              type="radio" 
              value="private" 
              className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
              {...register('profileVisibility')} 
            />
            <div>
              <p className="font-medium text-gray-900">Privé</p>
              <p className="text-sm text-gray-600">Profil non visible dans les recherches</p>
            </div>
          </label>
        </div>
      </div>

      {/* Informations visibles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Informations visibles
        </h3>
        
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">Afficher mon téléphone</span>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" {...register('showPhone')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">Afficher mon email</span>
            </div>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('showEmail')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">Afficher mes statistiques</span>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" {...register('showStats')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Afficher ma dernière connexion</span>
            <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" {...register('showLastSeen')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Apparaître dans les recherches</span>
            <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" {...register('showInSearchResults')} />
          </label>
        </div>
      </div>

      {/* Permissions de messagerie */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Qui peut m&apos;envoyer des messages ?</h3>
        
        <div className="space-y-2">
          <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input 
              type="radio" 
              value="everyone" 
              className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
              {...register('messagePermission')} 
            />
            <div>
              <p className="font-medium text-gray-900">Tout le monde</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input 
              type="radio" 
              value="verified_only" 
              className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
              {...register('messagePermission')} 
            />
            <div>
              <p className="font-medium text-gray-900">Utilisateurs vérifiés uniquement</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input 
              type="radio" 
              value="no_one" 
              className="mt-1 w-4 h-4 accent-primary cursor-pointer" 
              {...register('messagePermission')} 
            />
            <div>
              <p className="font-medium text-gray-900">Personne</p>
            </div>
          </label>
        </div>
      </div>

      {profileVisibility === 'private' && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning-dark">
            <strong>Attention :</strong> En mode privé, votre profil ne sera pas visible dans les recherches et vous ne recevrez pas de notifications de matching.
          </p>
        </div>
      )}

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