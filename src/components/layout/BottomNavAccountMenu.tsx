import { AnimatePresence, motion } from 'framer-motion';
import { X, Plane, Package, Heart, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { User as UserType } from '@/types';

interface BottomNavAccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  routes: {
    mesVoyages: string;
    mesDemandes: string;
    favoris: string;
    profile: string;
    settings: string;
  };
}

export default function BottomNavAccountMenu({
  isOpen,
  onClose,
  user,
  onNavigate,
  onLogout,
  routes,
}: BottomNavAccountMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
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
                onClick={onClose}
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
                  onClose();
                  onNavigate(routes.mesVoyages);
                }}
              />
              <MenuItem
                icon={<Package className="w-5 h-5" />}
                label="Mes demandes"
                onClick={() => {
                  onClose();
                  onNavigate(routes.mesDemandes);
                }}
              />
              <MenuItem
                icon={<Heart className="w-5 h-5" />}
                label="Favoris"
                onClick={() => {
                  onClose();
                  onNavigate(routes.favoris);
                }}
              />
              <MenuItem
                icon={<User className="w-5 h-5" />}
                label="Mon profil"
                onClick={() => {
                  onClose();
                  onNavigate(routes.profile);
                }}
              />
              <MenuItem
                icon={<Settings className="w-5 h-5" />}
                label="Paramètres"
                onClick={() => {
                  onClose();
                  onNavigate(routes.settings);
                }}
              />

              <div className="h-px bg-gray-200 my-2" />

              <MenuItem
                icon={<LogOut className="w-5 h-5" />}
                label="Déconnexion"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                danger
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
