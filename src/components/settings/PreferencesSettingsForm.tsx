'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, DollarSign, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';
import { preferencesSettingsSchema, type PreferencesSettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';

interface PreferencesSettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function PreferencesSettingsForm({ 
  settings, 
  onSubmit, 
  isLoading 
}: PreferencesSettingsFormProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<PreferencesSettingsFormData>({
    resolver: zodResolver(preferencesSettingsSchema),
    defaultValues: {
      langue: settings.langue,
      devise: settings.devise,
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Langue */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Globe className="w-4 h-4 text-primary" />
          Langue de l&apos;interface
        </label>
        <select className="input" {...register('langue')}>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
        {errors.langue && (
          <p className="text-sm text-error">{errors.langue.message}</p>
        )}
      </div>

      {/* Devise */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <DollarSign className="w-4 h-4 text-primary" />
          Devise préférée
        </label>
        <select className="input" {...register('devise')}>
          <option value="XAF">Franc CFA (XAF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar US (USD)</option>
        </select>
        {errors.devise && (
          <p className="text-sm text-error">{errors.devise.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Cette devise sera utilisée pour afficher les prix et commissions
        </p>
      </div>

      {/* Fuseau horaire */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Clock className="w-4 h-4 text-primary" />
          Fuseau horaire
        </label>
        <select className="input" {...register('timezone')}>
          <option value="Africa/Douala">Afrique/Douala (GMT+1)</option>
          <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
          <option value="Europe/London">Europe/Londres (GMT+0)</option>
          <option value="America/New_York">Amérique/New York (GMT-5)</option>
          <option value="America/Los_Angeles">Amérique/Los Angeles (GMT-8)</option>
        </select>
        {errors.timezone && (
          <p className="text-sm text-error">{errors.timezone.message}</p>
        )}
      </div>

      {/* Format de date */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 text-primary" />
          Format de date
        </label>
        <select className="input" {...register('dateFormat')}>
          <option value="dd/MM/yyyy">JJ/MM/AAAA (31/12/2025)</option>
          <option value="MM/dd/yyyy">MM/JJ/AAAA (12/31/2025)</option>
          <option value="yyyy-MM-dd">AAAA-MM-JJ (2025-12-31)</option>
        </select>
        {errors.dateFormat && (
          <p className="text-sm text-error">{errors.dateFormat.message}</p>
        )}
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