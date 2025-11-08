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
  Users,
  Plane
} from 'lucide-react';
import {
  AboutSection,
  HowItWorksSection,
  FaqSection
} from '@/components/sections';
import { ScrollToTop } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import HomeBannerAd from '@/components/ads/HomeBannerAd';

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

export default function HomePageClient() {
  const trustIndicators = [
    { icon: Shield, text: 'Inscription gratuite' },
    { icon: Clock, text: 'Transactions sécurisées' },
    { icon: HeadphonesIcon, text: 'Support 24/7' }
  ];

  const stats = [
    { icon: Users, value: 'Notre mission', label: 'Connecter le Cameroun et sa diaspora' },
    { icon: TrendingUp, value: 'Notre vision', label: 'Simplifier l\'envoi de colis à l\'international' },
    { icon: Sparkles, value: 'Notre promesse', label: 'Sécurité, simplicité, confiance' },
  ]


  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-light via-primary-dark to-primary text-white overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
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
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-secondary/90 backdrop-blur-sm rounded-full text-gray-900 font-semibold shadow-lg">
                  <Plane className="w-5 h-5" />
                  <span>Le monde à portée de bagage</span>
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
                className="text-lg md:text-[20px] mb-8 text-white/90 leading-relaxed"
              >
                La plateforme qui connecte le Cameroun et sa diaspora pour des envois de colis rapides, économiques et sécurisés — dans les deux sens
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <Link href={ROUTES.REGISTER}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 backdrop-blur-sm bg-secondary/90 text-white rounded-xl font-bold shadow-lg hover:bg-secondary/100 transition-colors"
                  >
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
                
                <Link href={ROUTES.EXPLORE}>
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
                      className="flex items-center gap-2 text-md text-white/90"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5" />
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
                  src="/images/hero/hero-image.webp"
                  alt="Transport de colis"
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-2xl object-cover w-full border-4 border-secondary"
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

      <HomeBannerAd 
        adSlot="1234567890"
        adFormat="auto"
        variant="display"
        className="bg-gray-50"
      />

      {/* Sections importées */}
      <AboutSection />

      <HomeBannerAd 
        adSlot="2345678901"
        adFormat="horizontal"
        variant="infeed"
        className="bg-white"
      />

      <HowItWorksSection />

      <HomeBannerAd 
        adSlot="3456789012"
        adFormat="auto"
        variant="display"
        className="bg-gray-50"
      />

      <FaqSection />

      {/* CTA Section - Version améliorée */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary-dark" />
        
        {/* Pattern décoratif */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} 
        />
        
        <div className="container-custom relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center text-white"
          >
            {/* Badge avec icône */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/90 backdrop-blur-sm rounded-full text-gray-900 font-bold mb-8">
              <Plane className="w-5 h-5" />
              Prêt à décoller ?
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Commencez à envoyer ou transporter dès aujourd&apos;hui
            </h2>
            
            <p className="text-xl mb-10 text-white/90 leading-relaxed">
              Rejoignez des centaines d&apos;utilisateurs qui font confiance à Co-Bage pour leurs envois de colis entre le Cameroun et le monde entier.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.REGISTER}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-secondary/90 text-gray-900 rounded-xl font-bold shadow-2xl hover:bg-secondary/100 transition-colors text-lg"
                >
                  Créer mon compte
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </Link>

              <Link href={ROUTES.EXPLORE}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 transition-colors text-lg"
                >
                  Voir les voyages
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll to top */}
      <ScrollToTop />
    </>
  );
}