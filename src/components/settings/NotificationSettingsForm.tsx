'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui';
import { notificationSettingsSchema, type NotificationSettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';

interface NotificationSettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function NotificationSettingsForm({ 
  settings, 
  onSubmit, 
  isLoading 
}: NotificationSettingsFormProps) {
  const { register, handleSubmit, formState: { isDirty } } = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotificationsEnabled: settings.emailNotificationsEnabled,
      smsNotificationsEnabled: settings.smsNotificationsEnabled,
      pushNotificationsEnabled: settings.pushNotificationsEnabled,
      notifyOnNewMessage: settings.notifyOnNewMessage,
      notifyOnMatchingVoyage: settings.notifyOnMatchingVoyage,
      notifyOnMatchingDemande: settings.notifyOnMatchingDemande,
      notifyOnNewAvis: settings.notifyOnNewAvis,
      notifyOnFavoriUpdate: settings.notifyOnFavoriUpdate,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Canaux de notification */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Canaux de notification
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <Mail className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
            </div>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('emailNotificationsEnabled')} />
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">SMS</p>
              <p className="text-sm text-gray-600">Recevoir des notifications par SMS</p>
            </div>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('smsNotificationsEnabled')} />
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Push</p>
              <p className="text-sm text-gray-600">Recevoir des notifications push</p>
            </div>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('pushNotificationsEnabled')} />
          </label>
        </div>
      </div>

      {/* Types de notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Types de notifications</h3>
        
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Nouveaux messages</span>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('notifyOnNewMessage')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Voyages correspondants</span>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('notifyOnMatchingVoyage')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Demandes correspondantes</span>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('notifyOnMatchingDemande')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Nouveaux avis</span>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('notifyOnNewAvis')} />
          </label>

          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <span className="text-gray-900">Mise à jour des favoris</span>
            <input type="checkbox" className="w-5 h-5 text-primary" {...register('notifyOnFavoriUpdate')} />
          </label>
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