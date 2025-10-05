'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui';
import { rgpdSettingsSchema, type RgpdSettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';
import { formatDate } from '@/lib/utils/format';

interface RgpdSettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  onExportData: () => Promise<void>;
  isLoading?: boolean;
  isExporting?: boolean;
}

export default function RgpdSettingsForm({ 
  settings, 
  onSubmit,
  onExportData,
  isLoading,
  isExporting
}: RgpdSettingsFormProps) {
  const { register, handleSubmit, formState: { isDirty } } = useForm<RgpdSettingsFormData>({
    resolver: zodResolver(rgpdSettingsSchema),
    defaultValues: {
      cookiesConsent: settings.cookiesConsent,
      analyticsConsent: settings.analyticsConsent,
      marketingConsent: settings.marketingConsent,
      dataShareConsent: settings.dataShareConsent,
    },
  });

  return (
    <div className="space-y-6">
      {/* Info RGPD */}
      <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-info-dark">Vos droits RGPD</p>
            <p className="text-gray-700">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données personnelles.
            </p>
          </div>
        </div>
      </div>

      {/* Consentements */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Gestion des consentements
          </h3>

          {settings.consentDate && (
            <p className="text-sm text-gray-600">
              Dernière mise à jour : {formatDate(settings.consentDate)}
            </p>
          )}
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 text-primary" 
                {...register('cookiesConsent')} 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Cookies essentiels</p>
                <p className="text-sm text-gray-600 mt-1">
                  Nécessaires au fonctionnement du site (connexion, panier, préférences)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 text-primary" 
                {...register('analyticsConsent')} 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Cookies analytiques</p>
                <p className="text-sm text-gray-600 mt-1">
                  Nous aident à comprendre comment vous utilisez le site pour l&apos;améliorer
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 text-primary" 
                {...register('marketingConsent')} 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Communications marketing</p>
                <p className="text-sm text-gray-600 mt-1">
                  Recevoir des offres et actualités personnalisées
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 text-primary" 
                {...register('dataShareConsent')} 
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Partage de données</p>
                <p className="text-sm text-gray-600 mt-1">
                  Autoriser le partage de données anonymisées avec nos partenaires
                </p>
              </div>
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
          Enregistrer mes choix
        </Button>
      </form>

      {/* Export des données */}
      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Portabilité des données</h3>
          <p className="text-sm text-gray-600">
            Téléchargez toutes vos données personnelles au format JSON
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onExportData}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exporter mes données
          </Button>
        </div>
      </div>

      {/* Suppression du compte */}
      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-error">Zone dangereuse</h3>
          <p className="text-sm text-gray-600">
            La suppression de votre compte est définitive et irréversible
          </p>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                alert('Fonctionnalité de suppression à implémenter');
              }
            }}
          >
            Supprimer mon compte
          </Button>
        </div>
      </div>
    </div>
  );
}