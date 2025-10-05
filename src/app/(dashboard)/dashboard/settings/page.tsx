'use client';

import { useState } from 'react';
import { Bell, Lock, Globe, Shield, Eye } from 'lucide-react';
import {
  NotificationSettingsForm,
  PrivacySettingsForm,
  PreferencesSettingsForm,
  RgpdSettingsForm,
  SecuritySettingsForm,
} from '@/components/settings';
import { useSettings, useSettingsActions } from '@/lib/hooks';
import { LoadingSpinner, ErrorState, useToast } from '@/components/common';
import type { UserSettings } from '@/types';

type TabKey = 'notifications' | 'privacy' | 'preferences' | 'rgpd' | 'security';

const tabs = [
  { key: 'notifications' as TabKey, label: 'Notifications', icon: Bell },
  { key: 'privacy' as TabKey, label: 'Confidentialité', icon: Eye },
  { key: 'preferences' as TabKey, label: 'Préférences', icon: Globe },
  { key: 'rgpd' as TabKey, label: 'RGPD', icon: Shield },
  { key: 'security' as TabKey, label: 'Sécurité', icon: Lock },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('notifications');
  const showToast = useToast();
  
  const { 
    settings, 
    isLoading, 
    error,
    refetch 
  } = useSettings();

  const {updateSettings, exportData} = useSettingsActions()

  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleUpdateSettings = async (data: Partial<UserSettings>) => {
    setIsUpdating(true);
    try {
      await updateSettings(data);
      showToast.success('Paramètres mis à jour avec succès');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      showToast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await exportData();
      showToast.success('Export des données réussi');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      showToast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner fullScreen text="Chargement des paramètres..." />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error || 'Impossible de charger les paramètres'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Onglets */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
                <NotificationSettingsForm
                  settings={settings}
                  onSubmit={handleUpdateSettings}
                  isLoading={isUpdating}
                />
              </div>
            )}

            {/* Confidentialité */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Confidentialité</h2>
                <PrivacySettingsForm
                  settings={settings}
                  onSubmit={handleUpdateSettings}
                  isLoading={isUpdating}
                />
              </div>
            )}

            {/* Préférences */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences</h2>
                <PreferencesSettingsForm
                  settings={settings}
                  onSubmit={handleUpdateSettings}
                  isLoading={isUpdating}
                />
              </div>
            )}

            {/* RGPD */}
            {activeTab === 'rgpd' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">RGPD & Données</h2>
                <RgpdSettingsForm
                  settings={settings}
                  onSubmit={handleUpdateSettings}
                  onExportData={handleExportData}
                  isLoading={isUpdating}
                  isExporting={isExporting}
                />
              </div>
            )}

            {/* Sécurité */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>
                <SecuritySettingsForm
                  settings={settings}
                  onSubmit={handleUpdateSettings}
                  isLoading={isUpdating}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}