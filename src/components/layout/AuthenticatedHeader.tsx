'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Flag,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { useUnreadNotificationCount, useUnreadMessages } from '@/lib/hooks';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { useToast } from '../common';

export default function AuthenticatedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const { unreadCount: notifCount } = useUnreadNotificationCount(true);
  const { unreadCount: messageCount } = useUnreadMessages(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.replace(ROUTES.HOME);
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 bg-white border-b',
        scrolled ? 'shadow-md border-gray-200' : 'border-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo - Version dashboard (responsive) */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/logo/logo-1.png"
              alt="Co-Bage"
              width={80}
              height={40}
              className="object-contain w-16 sm:w-20 h-auto"
            />
          </Link>

          {/* Spacer pour pousser les actions à droite */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Notifications */}
            <Link href={ROUTES.NOTIFICATIONS}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                {notifCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-error text-white text-[9px] sm:text-[10px] rounded-full flex items-center justify-center font-bold">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Messages */}
            <Link href={ROUTES.MESSAGES}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Messages"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                {messageCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-error text-white text-[9px] sm:text-[10px] rounded-full flex items-center justify-center font-bold">
                    {messageCount > 9 ? '9+' : messageCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            <Dropdown
              trigger={
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menu utilisateur"
                >
                  <Avatar
                    src={user?.photo || undefined}
                    fallback={`${user?.prenom?.charAt(0)}${user?.nom?.charAt(0)}`}
                    size="sm"
                    verified={user?.emailVerifie}
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] lg:max-w-none truncate">
                    {user?.prenom}
                  </span>
                </motion.button>
              }
              align="right"
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
              </div>

              <DropdownItem
                onClick={() => router.push(ROUTES.PROFILE)}
                icon={<User className="w-4 h-4" />}
              >
                Mon profil
              </DropdownItem>

              <DropdownItem
                onClick={() => router.push(ROUTES.DASHBOARD)}
                icon={<LayoutDashboard className="w-4 h-4" />}
              >
                Dashboard
              </DropdownItem>

              <DropdownItem
                onClick={() => router.push(ROUTES.SETTINGS)}
                icon={<Settings className="w-4 h-4" />}
              >
                Paramètres
              </DropdownItem>

              <DropdownItem
                onClick={() => router.push(ROUTES.SIGNALEMENTS)}
                icon={<Flag className="w-4 h-4" />}
              >
                Mes signalements
              </DropdownItem>

              <DropdownItem
                onClick={() => router.push(ROUTES.HELP)}
                icon={<HelpCircle className="w-4 h-4" />}
              >
                Aide & Support
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                onClick={handleLogout}
                danger
                icon={<LogOut className="w-4 h-4" />}
              >
                Déconnexion
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}
