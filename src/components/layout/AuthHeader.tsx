'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Users } from 'lucide-react';
import Image from 'next/image';
import { ROUTES } from '@/lib/utils/constants';

const features = [
  { icon: Shield, text: 'Sécurisé' },
  { icon: Zap, text: 'Rapide' },
  { icon: Users, text: 'Communauté' },
];

export default function AuthHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3">
            <div className="relative h-10 w-20 flex-shrink-0">
              <Image
                src="/images/logo/logo-1.png"
                alt="Co-Bage - Le monde à portée de bagage"
                className="object-contain"
                priority
                width={80}
                height={40}
              />
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
                  <span className="text-sm text-gray-700 font-medium">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bouton retour */}
          <Link href={ROUTES.HOME}>
            <div className="border-2 border-primary flex items-center gap-2 px-4 py-2 text-sm text-primary font-semibold hover:text-primary hover:bg-primary/5 rounded-lg transition-all hover:border-primary/20 hover:scale-110">
              <ArrowLeft className="w-4 h-4" />
              <span className="">Accueil</span>
            </div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
