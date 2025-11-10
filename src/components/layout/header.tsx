'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  User,
  LogOut,
  Settings,
  HelpCircle,
  BookOpen,
  Home,
  Info,
  Mail,
  Menu,
  X,
  Flag,
  LayoutDashboard,
  UserRoundPlus,
  Search,
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

const navigation = [
  { name: 'Accueil', href: ROUTES.HOME, icon: Home },
  { name: 'À propos', href: ROUTES.ABOUT, icon: Info },
  { name: 'Comment ça marche', href: ROUTES.HOW_IT_WORKS, icon: BookOpen },
  { name: 'Explorer', href: ROUTES.PUBLIC_EXPLORE, icon: Search },
  { name: 'Contact', href: ROUTES.CONTACT, icon: Mail },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const { unreadCount: notifCount } = useUnreadNotificationCount(isAuthenticated);
  const { unreadCount: messageCount } = useUnreadMessages(isAuthenticated);

  const isAuthPage = pathname?.includes('/auth');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.replace(ROUTES.HOME);
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (isAuthPage) {
    return null;
  }

  // Header pour visiteurs non connectés
  if (!isAuthenticated) {
    return (
      <>
        <header
          className={cn(
            'sticky top-0 z-50 transition-all duration-300 bg-white',
            scrolled && 'shadow-md'
          )}
        >
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
            {/* Logo - Responsive sizing */}
            <Link href={ROUTES.HOME} className="flex-shrink-0">
              <Image
                src="/images/logo/logo-1.png"
                alt="Co-Bage – Le monde à portée de bagage"
                width={112}
                height={56}
                priority
                className="object-contain w-20 sm:w-24 lg:w-28 h-auto"
              />
            </Link>

            {/* Navigation Desktop - Deux versions selon la taille d'écran */}
            
            {/* Version tablette (1024-1279px) : Navigation condensée prioritaire */}
            <div className="hidden lg:flex xl:hidden items-center gap-1 flex-1 justify-center">
              {navigation.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-2 text-[14px] font-medium rounded-lg transition-colors whitespace-nowrap',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}
              
              {/* Menu "Plus" pour les autres liens */}
              <Dropdown
                trigger={
                  <button className="flex items-center gap-1.5 px-2.5 py-2 text-[14px] font-medium rounded-lg text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
                    <Menu className="w-4 h-4" />
                    Plus
                  </button>
                }
                align="center"
              >
                {navigation.slice(3).map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownItem
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      icon={<Icon className="w-4 h-4" />}
                    >
                      {item.name}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>

            {/* Version grand écran (≥1280px) : Navigation complète */}
            <div className="hidden xl:flex items-center gap-1 flex-1 justify-center max-w-2xl">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}
            </div>

            {/* Actions - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Bouton Connexion - Caché sur très petits écrans */}
              <Link href={ROUTES.LOGIN} className="hidden sm:block">
                <button className="border-2 border-gray-300 shadow-md rounded-lg px-3 sm:px-4 lg:px-5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap">
                  Connexion
                </button>
              </Link>

              {/* Bouton Inscription */}
              <Link href={ROUTES.REGISTER} className="hidden sm:block">
                <button className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-all whitespace-nowrap">
                  Inscription
                </button>
              </Link>

              {/* Menu Hamburger Mobile - Visible jusqu'à lg */}
              <div className="flex items-center gap-2 lg:hidden">
                {/* Bouton Connexion mobile compact */}
                <Link href={ROUTES.LOGIN} className="sm:hidden">
                  <button className="px-2.5 py-1.5 text-xs font-medium bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-all">
                    Connexion
                  </button>
                </Link>

                {/* Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Menu Mobile - Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <button
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {item.name}
                      </button>
                    </Link>
                  );
                })}

                {/* Actions mobile dans le menu */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 space-y-2">
                  <Link href={ROUTES.REGISTER}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                      <UserRoundPlus className="w-5 h-5" />
                      Inscription
                    </button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Header pour utilisateurs connectés
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