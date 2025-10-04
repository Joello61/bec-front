'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  Search, 
  Shield, 
  Clock, 
  HeadphonesIcon,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import {
  AboutSection,
  HowItWorksSection,
  FaqSection
} from '@/components/sections';
import { ScrollToTop } from '@/components/common';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const trustIndicators = [
    { icon: Shield, text: 'Inscription gratuite' },
    { icon: Clock, text: 'Transactions sécurisées' },
    { icon: HeadphonesIcon, text: 'Support 24/7' }
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Utilisateurs actifs' },
    { icon: TrendingUp, value: '1000+', label: 'Colis livrés' },
    { icon: Sparkles, value: '98%', label: 'Satisfaction' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-light via-primary-dark to-primary text-white overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} 
          />
        </div>
        
        <div className="container-custom relative py-4 md:py-12 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-8 items-center">
            {/* Colonne gauche - Contenu (8 colonnes) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-8 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div 
                variants={fadeIn} 
                className="flex justify-center lg:justify-start mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Plateforme N°1 au Cameroun
                </div>
              </motion.div>

              {/* Titre principal */}
              <motion.h1
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Envoyez vos colis de manière intelligente
              </motion.h1>

              {/* Sous-titre */}
              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed"
              >
                Connectez-vous avec des voyageurs pour transporter vos colis de manière économique, rapide et sécurisée entre le Cameroun et le monde entier.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <Link href="/auth/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
                
                <Link href="/dashboard/mes-voyages">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    Explorer les voyages
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeIn}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                {trustIndicators.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-white/90"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Colonne droite - Image (4 colonnes, cachée sur mobile) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden lg:block lg:col-span-4"
            >
              <div className="relative">
                <Image
                  src="/images/hero/hero-image.jpg"
                  alt="Transport de colis"
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-2xl object-cover w-full"
                  priority
                />
                {/* Overlay subtil */}
                 <div className="absolute inset-0 bg-primary/20 mix-blend-multiply rounded-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Sections importées */}
      <AboutSection />
      <HowItWorksSection />
      <FaqSection />

      {/* CTA Section - Version améliorée */}
      <section className="relative py-20 overflow-hidden">
        {/* Fond avec dégradé subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary-dark" />
        
        <div className="container-custom relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center text-white"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Rejoignez-nous dès maintenant
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Prêt à commencer ?
            </h2>
            
            <p className="text-lg md:text-xl mb-10 text-white/80 leading-relaxed">
              Rejoignez des centaines d&apos;utilisateurs qui font confiance à CoBage pour leurs envois de colis.
            </p>
            
            <Link href="/auth/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-xl hover:bg-gray-100 transition-colors"
              >
                Créer mon compte gratuitement
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scroll to top */}
      <ScrollToTop />
    </>
  );
}