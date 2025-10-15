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
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { useUnreadNotificationCount, useUnreadMessages } from '@/lib/hooks';
import { Avatar, Dropdown, DropdownItem, DropdownDivider } from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { useToast } from '../common';

const navigation = [
  { name: "Accueil", href: ROUTES.HOME, icon: Home },
  { name: "À propos", href: ROUTES.ABOUT, icon: Info },
  { name: "Comment ça marche", href: ROUTES.HOW_IT_WORKS, icon: BookOpen },
  { name: "Contact", href: ROUTES.CONTACT, icon: Mail },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount: notifCount } = useUnreadNotificationCount(isAuthenticated);
  const { unreadCount: messageCount } = useUnreadMessages(isAuthenticated);
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthPage = pathname?.includes('/auth')

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
      toast.info('Déconnexion réussie');
      router.push(ROUTES.HOME);
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (isAuthPage) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <header className={cn(
          'sticky top-0 z-50 transition-all duration-300 bg-white',
          scrolled && 'shadow-md'
        )}>
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo - Version optimisée pour 3000x1500 (ratio 2:1) */}
            <Link href={ROUTES.HOME} className="flex items-center gap-3">
              <div className="relative h-14 w-28 flex-shrink-0">
                <Image
                  src="/images/logo/logo-1.png"
                  alt="Co-Bage - Le monde à portée de bagage"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href={ROUTES.LOGIN} className="hidden sm:block">
                <button className="border-2 border-gray-300 shadow-md rounded-lg px-5 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Connexion
                </button>
              </Link>
              <Link href={ROUTES.REGISTER} className="hidden sm:block">
                <button className="px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-all">
                  Inscription
                </button>
              </Link>

              {/* Menu Hamburger Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </nav>
        </header>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 space-y-1">
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
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </button>
                    </Link>
                  );
                })}

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 space-y-2">
                  <Link href={ROUTES.LOGIN}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Connexion
                    </button>
                  </Link>
                  <Link href={ROUTES.REGISTER}>
                    <button className="w-full px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
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
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300 bg-white border-b',
      scrolled ? 'shadow-md border-gray-200' : 'border-transparent'
    )}>
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo - Version dashboard (icône uniquement ou logo complet) */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 flex-shrink-0">
            {/* Option 1: Logo complet (recommandé si logo-1.png est votre logo principal) */}
            <div className="relative h-10 w-20">
              <Image
                src="/images/logo/logo-1.png"
                alt="Co-Bage"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Option 2: Icône seule (décommentez si vous préférez) */}
            {/* 
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo/logo_icon_only.png"
                alt="Co-Bage"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-lg text-gray-900">CoBage</span>
            */}
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Link href={ROUTES.NOTIFICATIONS}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold">
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
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-gray-700" />
                {messageCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold">
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
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar
                    src={user?.photo || undefined}
                    fallback={`${user?.prenom?.charAt(0)}${user?.nom?.charAt(0)}`}
                    size="sm"
                    verified={user?.emailVerifie}
                  />
                  <span className="hidden lg:block text-sm font-medium text-gray-700">
                    {user?.prenom}
                  </span>
                </motion.button>
              }
              align="right"
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </div>
              
              <DropdownItem
                onClick={() => router.push(ROUTES.PROFILE)}
                icon={<User className="w-4 h-4" />}
              >
                Mon profil
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