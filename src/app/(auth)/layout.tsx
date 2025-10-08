'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Users } from 'lucide-react';
import Image from 'next/image';
import { ROUTES } from '@/lib/utils/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = [
    { icon: Shield, text: 'Sécurisé' },
    { icon: Zap, text: 'Rapide' },
    { icon: Users, text: 'Communauté' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header fixe avec délimitation claire */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-primary bg-white">
                  <Image
                    src="/images/logo/logo_icon_only.png"
                    alt="Logo de Co-Baggage"
                    width={45}
                    height={45}
                    className="object-cover w-full h-full"
                  />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1 bg-primary/20 rounded-xl blur-md -z-10"
                />
              </motion.div>
              <div>
                <span className="font-bold text-xl text-gray-900 block leading-tight">
                  CoBage
                </span>
              </div>
            </Link>

            {/* Features badges (cachés sur mobile) */}
            <div className="hidden md:flex items-center gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Bouton retour */}
            <Link href={ROUTES.HOME}>
              <motion.div
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all border border-transparent hover:border-primary/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Retour</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Contenu principal avec scroll */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-custom py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Footer fixe avec délimitation claire */}
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
              © {new Date().getFullYear()} CoBage. Tous droits réservés.
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
              <span className="text-xs font-medium text-primary">Plateforme sécurisée</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}