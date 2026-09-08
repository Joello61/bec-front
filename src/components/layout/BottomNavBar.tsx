import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface BottomNavItem {
  name: string;
  href?: string;
  action?: () => void;
  icon: LucideIcon;
  isCenter?: boolean;
  badge?: number;
}

interface BottomNavBarProps {
  navigation: BottomNavItem[];
  isActive: (href: string) => boolean;
  onNavigate: (href: string) => void;
}

export default function BottomNavBar({ navigation, isActive, onNavigate }: BottomNavBarProps) {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden pb-4 fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl safe-area-bottom"
    >
      <div className="flex items-end justify-around px-2 pb-2 pt-2">
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
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center ">
                  <Icon strokeWidth={4} className="w-6 h-6 text-white" />
                </div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.name}
              onClick={() => item.href ? onNavigate(item.href) : item.action?.()}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center gap-1 px-3 py-2 min-w-[64px]"
            >
              <div className={cn(
                'relative p-0 rounded-xl transition-all',
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
  );
}
