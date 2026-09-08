'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/lib/utils/constants';

export default function AuthFooter() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-sm"
    >
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-600 text-center md:text-left">
            © {new Date().getFullYear()} Co-Bage. Tous droits réservés.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href={ROUTES.TERMS}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Conditions
            </Link>
            <Link
              href={ROUTES.PRIVACY}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              Plateforme sécurisée
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
