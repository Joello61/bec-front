import { MessageSquare, Package, Plane, Star } from 'lucide-react';
import type { Route } from 'next';

import ModerationSectionCard from '@/components/admin/moderations/ModerationSectionCard';
import { ROUTES } from '@/lib/utils/constants';

const moderationSections = [
  {
    title: 'Voyages',
    description: 'Modérer les annonces de voyages',
    icon: <Plane className="w-6 h-6 text-primary" />,
    href: ROUTES.ADMIN_MODERATION_VOYAGES,
    color: 'primary',
  },
  {
    title: 'Demandes',
    description: 'Modérer les demandes de transport',
    icon: <Package className="w-6 h-6 text-secondary" />,
    href: ROUTES.ADMIN_MODERATION_DEMANDES,
    color: 'secondary',
  },
  {
    title: 'Avis',
    description: 'Gérer les avis et notes',
    icon: <Star className="w-6 h-6 text-warning" />,
    href: ROUTES.ADMIN_MODERATION_AVIS,
    color: 'warning',
  },
  {
    title: 'Messages',
    description: 'Modérer les messages signalés',
    icon: <MessageSquare className="w-6 h-6 text-info" />,
    href: '/admin/moderation/messages' as Route,
    color: 'info',
  },
];

export default function AdminModerationPageClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Modération</h1>
        <p className="text-gray-500 mt-1">
          Gérer les contenus de la plateforme
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moderationSections.map((section, index) => (
          <ModerationSectionCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            href={section.href}
            color={section.color}
            index={index}
          />
        ))}
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> Toutes les actions de modération sont
          enregistrées dans les logs et peuvent être consultées dans la section
          Logs.
        </p>
      </div>
    </div>
  );
}
