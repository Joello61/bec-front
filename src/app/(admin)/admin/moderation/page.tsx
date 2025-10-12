'use client';

import Link from 'next/link';
import { Plane, Package, Star, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import { motion } from 'framer-motion';
import { Route } from 'next';

export default function AdminModerationPage() {
  const moderationSections = [
    {
      title: 'Voyages',
      description: 'Modérer les annonces de voyages',
      icon: Plane,
      href: ROUTES.ADMIN_MODERATION_VOYAGES,
      color: 'primary',
    },
    {
      title: 'Demandes',
      description: 'Modérer les demandes de transport',
      icon: Package,
      href: ROUTES.ADMIN_MODERATION_DEMANDES,
      color: 'secondary',
    },
    {
      title: 'Avis',
      description: 'Gérer les avis et notes',
      icon: Star,
      href: ROUTES.ADMIN_MODERATION_AVIS,
      color: 'warning',
    },
    {
      title: 'Messages',
      description: 'Modérer les messages signalés',
      icon: MessageSquare,
      href: '/admin/moderation/messages' as Route,
      color: 'info',
    },
  ];

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
        {moderationSections.map((section, index) => {
          const Icon = section.icon;

          return (
            <Link key={section.title} href={section.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${section.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${section.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
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