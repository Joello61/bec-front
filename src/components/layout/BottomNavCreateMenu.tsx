import { AnimatePresence, motion } from 'framer-motion';
import { X, Plane, Package, Handshake } from 'lucide-react';

interface BottomNavCreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  routes: {
    mesVoyages: string;
    mesDemandes: string;
    mesPropositions: string;
  };
}

export default function BottomNavCreateMenu({ isOpen, onClose, onNavigate, routes }: BottomNavCreateMenuProps) {
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
              <h3 className="text-lg font-bold text-gray-900">Créer</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigate(routes.mesVoyages);
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
                  onClose();
                  onNavigate(routes.mesDemandes);
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
              <button
                onClick={() => {
                  onClose();
                  onNavigate(routes.mesPropositions);
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
