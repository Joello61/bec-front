'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MessageSquare,
  User,
  Plane,
  Package,
  Heart,
  Settings,
  LogOut,
  X,
  LayoutDashboard,
  //Handshake,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { useUnreadMessages } from '@/lib/hooks';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { useToast } from '../common';

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
      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl safe-area-bottom"
      >
        <div className="flex items-end justify-around px-2 pb-2 pt-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href ? isActive(item.href) : false;

            if (item.isCenter) {
              return (
                <motion.button
                  key={item.name}
                  onClick={item.action}
                  whileTap={{ scale: 0.9 }}
                  className="relative -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center shadow-xl shadow-primary/30">
                    <Icon strokeWidth={4} className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md -z-10" />
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.name}
                onClick={() => item.href ? router.push(item.href) : item.action?.()}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center gap-1 px-3 py-2 min-w-[64px]"
              >
                <div className={cn(
                  'relative p-2 rounded-xl transition-all',
                  active && 'bg-primary/10'
                )}>
                  <Icon strokeWidth={3} className={cn(
                    'w-5 h-5 transition-colors',
                    active ? 'text-primary' : 'text-gray-600'
                  )} />
                  
                  {/* Badge sur l'icône */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}
                </div>
                
                <span className={cn(
                  'text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-gray-600'
                )}>
                  {item.name}
                </span>

                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Create Menu Modal */}
      <AnimatePresence>
        {showCreateMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setShowCreateMenu(false)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 lg:hidden safe-area-bottom"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Créer</h3>
                <button
                  onClick={() => setShowCreateMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCreateMenu(false);
                    router.push(ROUTES.MES_VOYAGES);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Gérer mes voyages</p>
                    <p className="text-sm text-white/80">Proposez de transporter des colis</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowCreateMenu(false);
                    router.push(ROUTES.MES_DEMANDES);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Gérer mes demandes</p>
                    <p className="text-sm text-gray-600">Demandez le transport d&apos;un colis</p>
                  </div>
                </button>

                {/*
                  <button
                  onClick={() => {
                    setShowCreateMenu(false);
                    router.push(ROUTES.MES_PROPOSITIONS);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Gérer mes propositions</p>
                    <p className="text-sm text-gray-600">Accepter, refuser ou annuler</p>
                  </div>
                </button>
                */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Menu Modal */}
      <AnimatePresence>
        {showAccountMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setShowAccountMenu(false)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 lg:hidden safe-area-bottom"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Mon compte</h3>
                <button
                  onClick={() => setShowAccountMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <MenuItem
                  icon={<Plane className="w-5 h-5" />}
                  label="Mes voyages"
                  onClick={() => {
                    setShowAccountMenu(false);
                    router.push(ROUTES.MES_VOYAGES);
                  }}
                />
                <MenuItem
                  icon={<Package className="w-5 h-5" />}
                  label="Mes demandes"
                  onClick={() => {
                    setShowAccountMenu(false);
                    router.push(ROUTES.MES_DEMANDES);
                  }}
                />
                <MenuItem
                  icon={<Heart className="w-5 h-5" />}
                  label="Favoris"
                  onClick={() => {
                    setShowAccountMenu(false);
                    router.push(ROUTES.FAVORIS);
                  }}
                />
                <MenuItem
                  icon={<User className="w-5 h-5" />}
                  label="Mon profil"
                  onClick={() => {
                    setShowAccountMenu(false);
                    router.push(ROUTES.PROFILE);
                  }}
                />
                <MenuItem
                  icon={<Settings className="w-5 h-5" />}
                  label="Paramètres"
                  onClick={() => {
                    setShowAccountMenu(false);
                    router.push(ROUTES.SETTINGS);
                  }}
                />
                
                <div className="h-px bg-gray-200 my-2" />
                
                <MenuItem
                  icon={<LogOut className="w-5 h-5" />}
                  label="Déconnexion"
                  onClick={() => {
                    setShowAccountMenu(false);
                    handleLogout();
                  }}
                  danger
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuItem({ icon, label, onClick, danger = false }: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
        danger 
          ? 'text-error hover:bg-error/10' 
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}