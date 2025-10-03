/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, Package, MessageSquare, Bell, Heart, User,
  Plus, ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'Mon Dashboard',
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      color: 'text-primary-dark',
      bgColor: 'bg-primary-dark/10',
    },
    {
      name: 'Mes Voyages',
      href: ROUTES.MES_VOYAGES,
      icon: Plane,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Mes Demandes',
      href: ROUTES.MES_DEMANDES,
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      name: 'Messages',
      href: ROUTES.MESSAGES,
      icon: MessageSquare,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      name: 'Notifications',
      href: ROUTES.NOTIFICATIONS,
      icon: Bell,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      name: 'Favoris',
      href: ROUTES.FAVORIS,
      icon: Heart,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      name: 'Mon Profil',
      href: ROUTES.PROFILE,
      icon: User,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.MES_VOYAGES || href === ROUTES.MES_DEMANDES) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  return (
    <>
      {/* Overlay Mobile */}
      <AnimatePresence>
        {isOpen && onClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop (sans animation) */}
      <aside className="hidden lg:block fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200">
        <SidebarContent 
          user={user} 
          navigation={navigation} 
          isActive={isActive}
          pathname={pathname}
        />
      </aside>

      {/* Sidebar Mobile (avec animation) */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="lg:hidden fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 shadow-xl"
      >
        <SidebarContent 
          user={user} 
          navigation={navigation} 
          isActive={isActive}
          pathname={pathname}
          onClose={onClose}
        />
      </motion.aside>
    </>
  );
}

// Composant pour éviter la duplication
function SidebarContent({ user, navigation, isActive, pathname, onClose }: any) {
  return (
    <div className="h-full flex flex-col">
      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <span className="text-primary font-bold text-lg">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item: any) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.name}>
                <Link href={item.href} onClick={onClose} className="block">
                  <div className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    active ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      active ? 'bg-white/20' : item.bgColor
                    )}>
                      <Icon className={cn('w-4 h-4', active ? 'text-white' : item.color)} />
                    </div>
                    <span className="flex-1">{item.name}</span>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50/50 flex flex-col gap-2">
        <Link href={`${ROUTES.MES_VOYAGES}?action=create`}>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium shadow-md hover:bg-primary-dark transition-colors">
            <Plus className="w-5 h-5" />
            <span>Créer un voyage</span>
          </button>
        </Link>
        <Link href={`${ROUTES.MES_DEMANDES}?action=create`}>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Créer une demande</span>
          </button>
        </Link>
      </div>
    </div>
  );
}