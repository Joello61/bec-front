'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Plane, 
  Package, 
  MessageSquare, 
  Bell, 
  Heart, 
  User,
  Plus,
  ChevronRight
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
      name: 'Mes Voyages',
      href: ROUTES.VOYAGES,
      icon: Plane,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Mes Demandes',
      href: ROUTES.DEMANDES,
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
    if (href === ROUTES.VOYAGES || href === ROUTES.DEMANDES) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const sidebarVariants: Variants = {
    open: { 
      x: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: -280, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring' as const,
        stiffness: 300,
        damping: 25
      }
    })
  };

  return (
    <>
      {/* Overlay Mobile avec animation */}
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

      {/* Sidebar avec animation */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 lg:translate-x-0 shadow-xl lg:shadow-none"
      >
        <div className="h-full flex flex-col">
          {/* User Info avec effet glassmorphism */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 border-b border-gray-200 bg-gray-50/50"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring' as const, stiffness: 400 }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <span className="text-primary font-bold text-lg">
                    {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                  </span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1 bg-primary/10 rounded-full blur-md -z-10"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation avec animations */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.li 
                    key={item.name}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all overflow-hidden',
                          active
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {/* Icône avec fond coloré */}
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          active ? 'bg-white/20' : item.bgColor
                        )}>
                          <Icon className={cn(
                            'w-4 h-4',
                            active ? 'text-white' : item.color
                          )} />
                        </div>
                        
                        <span className="flex-1">{item.name}</span>
                        
                        {/* Chevron pour item actif */}
                        <AnimatePresence>
                          {active && (
                            <motion.div
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: -10, opacity: 0 }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Effet de brillance au survol */}
                        {!active && (
                          <motion.div
                            className="absolute inset-0"
                            initial={{ x: -100, opacity: 0 }}
                            whileHover={{ 
                              x: [100, 200],
                              opacity: [0, 0.1, 0]
                            }}
                            transition={{ duration: 0.6 }}
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                            }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Actions avec animations élégantes */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-t border-gray-200 space-y-2 bg-gray-50/50"
          >
            <Link href={`${ROUTES.VOYAGES}?action=create`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium shadow-md group"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <span>Créer un voyage</span>
                
                {/* Effet de brillance */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ x: -100, opacity: 0 }}
                  whileHover={{
                    x: [100, 200],
                    opacity: [0, 0.2, 0]
                  }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                  }}
                />
              </motion.div>
            </Link>

            <Link href={`${ROUTES.DEMANDES}?action=create`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors group"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
                <span>Créer une demande</span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}