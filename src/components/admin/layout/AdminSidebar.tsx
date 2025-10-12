'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  BarChart3,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.ADMIN_DASHBOARD,
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble',
    },
    {
      name: 'Statistiques',
      href: ROUTES.ADMIN_STATS,
      icon: BarChart3,
      description: 'Stats détaillées',
    },
    {
      name: 'Utilisateurs',
      href: ROUTES.ADMIN_USERS,
      icon: Users,
      description: 'Gestion users',
    },
    {
      name: 'Modération',
      href: ROUTES.ADMIN_MODERATION,
      icon: Shield,
      description: 'Contenus',
    },
    {
      name: 'Logs',
      href: ROUTES.ADMIN_LOGS,
      icon: FileText,
      description: 'Historique actions',
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.ADMIN_DASHBOARD) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-2xl">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">

          {/* Admin Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center ring-2 ring-primary/30">
              <span className="text-white font-bold text-sm">
                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-400">Administrateur</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: active ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer',
                        active
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      )}
                    >
                      <div
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                          active ? 'bg-white/20' : 'bg-gray-700/50'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-[18px] h-[18px]',
                            active ? 'text-white' : 'text-gray-400'
                          )}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="truncate">{item.name}</p>
                        <p
                          className={cn(
                            'text-xs truncate',
                            active ? 'text-white/70' : 'text-gray-500'
                          )}
                        >
                          {item.description}
                        </p>
                      </div>

                      {active && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Retour au dashboard */}
        <div className="p-3 border-t border-gray-700">
          <Link href={ROUTES.DASHBOARD}>
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au dashboard</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </aside>
  );
}