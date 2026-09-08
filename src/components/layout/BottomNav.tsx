'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';
import {
  Search,
  Plus,
  MessageSquare,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { useUnreadMessages } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { useToast } from '../common';
import BottomNavBar, { type BottomNavItem } from './BottomNavBar';
import BottomNavCreateMenu from './BottomNavCreateMenu';
import BottomNavAccountMenu from './BottomNavAccountMenu';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount: messageCount } = useUnreadMessages();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const toast = useToast();

  const isActive = (href: string) => {
    if (href === ROUTES.MES_VOYAGES || href === ROUTES.MES_DEMANDES) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Déconnexion réussie');
      router.replace(ROUTES.HOME);
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const navigation: BottomNavItem[] = [
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
      name: 'Créer',
      action: () => setShowCreateMenu(true),
      icon: Plus,
      isCenter: true,
    },
    {
      name: 'Messages',
      href: ROUTES.MESSAGES,
      icon: MessageSquare,
      badge: messageCount,
    },
    {
      name: 'Compte',
      action: () => setShowAccountMenu(true),
      icon: User,
    },
  ];

  return (
    <>
      <BottomNavBar
        navigation={navigation}
        isActive={isActive}
        onNavigate={(href) => router.push(href as Route)}
      />

      <BottomNavCreateMenu
        isOpen={showCreateMenu}
        onClose={() => setShowCreateMenu(false)}
        onNavigate={(href) => router.push(href as Route)}
        routes={{
          mesVoyages: ROUTES.MES_VOYAGES,
          mesDemandes: ROUTES.MES_DEMANDES,
          mesPropositions: ROUTES.MES_PROPOSITIONS,
        }}
      />

      <BottomNavAccountMenu
        isOpen={showAccountMenu}
        onClose={() => setShowAccountMenu(false)}
        user={user}
        onNavigate={(href) => router.push(href as Route)}
        onLogout={handleLogout}
        routes={{
          mesVoyages: ROUTES.MES_VOYAGES,
          mesDemandes: ROUTES.MES_DEMANDES,
          favoris: ROUTES.FAVORIS,
          profile: ROUTES.PROFILE,
          settings: ROUTES.SETTINGS,
        }}
      />
    </>
  );
}
