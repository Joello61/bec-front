'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  Menu, 
  X, 
  User, 
  Heart, 
  LogOut,
  Plane,
  Package,
  BookOpen,
  Info,
  Mail,
  Home,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { useUnreadNotificationCount, useUnreadMessages } from '@/lib/hooks';
import { Avatar, Dropdown, DropdownItem, DropdownDivider } from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount: notifCount } = useUnreadNotificationCount();
  const { unreadCount: messageCount } = useUnreadMessages();

  // Détection du scroll pour effet glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Accueil", href: ROUTES.HOME, icon: Home },
    { name: "À propos", href: ROUTES.ABOUT, icon: Info },
    { name: "Comment ça marche", href: ROUTES.HOW_IT_WORKS, icon: BookOpen },
    { name: "Voyages", href: ROUTES.VOYAGES, icon: Plane },
    { name: "Demandes", href: ROUTES.DEMANDES, icon: Package },
    { name: "Contact", href: ROUTES.CONTACT, icon: Mail },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await logout();
    window.location.href = ROUTES.HOME;
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled 
          ? 'glass shadow-md' 
          : 'bg-white'
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo avec animation */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -inset-1 bg-primary/20 rounded-xl blur-sm -z-10"
              />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-gray-900 block leading-tight">
                Bagage Express
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive(item.href)
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                  </motion.div>
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications avec badge animé */}
                <Link
                  href={ROUTES.NOTIFICATIONS}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {notifCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                      >
                        {notifCount > 9 ? '9+' : notifCount}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>

                {/* Messages avec badge animé */}
                <Link
                  href={ROUTES.MESSAGES}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-700" />
                    {messageCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                      >
                        {messageCount > 9 ? '9+' : messageCount}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>

                {/* User Menu avec animation */}
                <Dropdown
                  trigger={
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Avatar
                        src={user?.photo || undefined}
                        fallback={user ? `${user.nom} ${user.prenom}` : 'U'}
                        size="sm"
                        verified={user?.emailVerifie}
                      />
                    </motion.button>
                  }
                  align="right"
                >
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <DropdownItem
                    onClick={() => (window.location.href = ROUTES.PROFILE)}
                    icon={<User className="w-4 h-4" />}
                  >
                    Mon profil
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => (window.location.href = ROUTES.FAVORIS)}
                    icon={<Heart className="w-4 h-4" />}
                  >
                    Mes favoris
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
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                  >
                    Connexion
                  </motion.button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 105, 92, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                  >
                    Inscription
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button avec animation */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu avec animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}

                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navigation.length * 0.05 }}
                    >
                      <Link
                        href={ROUTES.NOTIFICATIONS}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex items-center gap-3">
                          <Bell className="w-4 h-4" />
                          Notifications
                        </span>
                        {notifCount > 0 && (
                          <span className="w-6 h-6 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {notifCount > 9 ? '9+' : notifCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (navigation.length + 1) * 0.05 }}
                    >
                      <Link
                        href={ROUTES.MESSAGES}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4" />
                          Messages
                        </span>
                        {messageCount > 0 && (
                          <span className="w-6 h-6 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {messageCount > 9 ? '9+' : messageCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                    <div className="h-px bg-gray-200 my-2" />
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      Mon profil
                    </Link>
                    <Link
                      href={ROUTES.FAVORIS}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Heart className="w-4 h-4" />
                      Mes favoris
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2 border-2 border-primary p-3 rounded-2xl mt-3">
                    <Link
                      href={ROUTES.LOGIN}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-center text-gray-700 hover:bg-gray-100"
                    >
                      Connexion
                    </Link>
                    <Link
                      href={ROUTES.REGISTER}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-center bg-primary text-white hover:bg-primary-dark"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}