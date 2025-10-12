'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Shield, FileText, BarChart3 } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

export default function AdminQuickActions() {
  const actions = [
    {
      label: 'Voir utilisateurs',
      href: ROUTES.ADMIN_USERS,
      icon: Users,
      color: 'primary',
    },
    {
      label: 'Modération',
      href: ROUTES.ADMIN_MODERATION,
      icon: Shield,
      color: 'warning',
    },
    {
      label: 'Stats détaillées',
      href: ROUTES.ADMIN_STATS,
      icon: BarChart3,
      color: 'info',
    },
    {
      label: 'Consulter logs',
      href: ROUTES.ADMIN_LOGS,
      icon: FileText,
      color: 'secondary',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <Link key={action.label} href={action.href}>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex flex-col items-center gap-3 p-4 rounded-lg bg-${action.color}/10 hover:bg-${action.color}/20 transition-colors`}
              >
                <Icon className={`w-6 h-6 text-${action.color}`} />
                <span className="text-sm font-medium text-gray-700 text-center">
                  {action.label}
                </span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}