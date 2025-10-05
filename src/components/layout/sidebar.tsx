'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search,
  Plane, 
  Package, 
  MessageSquare, 
  Bell, 
  Heart,
  Settings,
  HelpCircle,
  ChevronRight,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      name: 'Explorer',
      href: ROUTES.EXPLORE,
      icon: Search,
    },
    {
      name: 'Mes Voyages',
      href: ROUTES.MES_VOYAGES,
      icon: Plane,
    },
    {
      name: 'Mes Demandes',
      href: ROUTES.MES_DEMANDES,
      icon: Package,
    },
    {
      name: 'Messages',
      href: ROUTES.MESSAGES,
      icon: MessageSquare,
    },
    {
      name: 'Notifications',
      href: ROUTES.NOTIFICATIONS,
      icon: Bell,
    },
    {
      name: 'Favoris',
      href: ROUTES.FAVORIS,
      icon: Heart,
    },
    {
      name: 'Profil',
      href: ROUTES.PROFILE,
      icon: User
    }
  ];

  const bottomNavigation = [
    {
      name: 'Paramètres',
      href: ROUTES.SETTINGS,
      icon: Settings,
    },
    {
      name: 'Aide',
      href: ROUTES.HELP,
      icon: HelpCircle,
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.MES_VOYAGES || href === ROUTES.MES_DEMANDES) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  return (
    <aside className="hidden lg:block fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200">
      <div className="h-full flex flex-col">
        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/20 shadow-md">
                <span className="text-white font-bold text-base">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </span>
              </div>
              {user?.emailVerifie && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
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
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
                        active 
                          ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25' 
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                        active ? 'bg-white/20' : 'bg-primary/10'
                      )}>
                        <Icon className={cn(
                          'w-[18px] h-[18px]', 
                          active ? 'text-white' : 'text-primary'
                        )} />
                      </div>
                      
                      <span className="flex-1">{item.name}</span>
                      
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

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Navigation secondaire */}
          <ul className="space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
                      active 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50'
                    )}>
                      <Icon className="w-[18px] h-[18px]" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}