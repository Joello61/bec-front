'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  DollarSign, 
  Shield, 
  Users, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

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

export function AboutSection() {
  const features = [
    {
      icon: DollarSign,
      title: 'Économique',
      description: 'Des tarifs compétitifs pour l\'expédition de vos colis grâce au partage d\'espace bagages.',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Système d\'évaluation et de vérification pour des transactions en toute confiance.',
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      icon: Zap,
      title: 'Rapide',
      description: 'Livraison express via des voyageurs déjà en déplacement vers votre destination.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Rejoignez une communauté solidaire de voyageurs et d\'expéditeurs de confiance.',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Pourquoi nous choisir
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            À propos de Bagage Express
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            La première plateforme camerounaise de mise en relation entre voyageurs et expéditeurs pour un transport de colis intelligent et économique.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                {/* Effet de glow au survol */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Carte */}
                <div className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-4`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative overflow-hidden"
        >
          {/* Décorations d'arrière-plan */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative bg-white rounded-2xl p-6 md:p-10 border border-gray-200 shadow-sm">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Colonne gauche - Texte */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Notre Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Faciliter l&apos;envoi de colis entre le Cameroun et le reste du monde en connectant les personnes qui voyagent avec celles qui ont besoin de faire transporter des objets.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Une solution gagnant-gagnant qui optimise l&apos;espace bagages tout en réduisant les coûts d&apos;expédition.
                  </p>
                  <Link href="/how-it-works">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-md"
                    >
                      Découvrir comment ça marche
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </div>

                {/* Colonne droite - Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <div className="text-3xl font-bold text-primary mb-1">100%</div>
                    <div className="text-sm text-gray-600">Gratuit pour commencer</div>
                  </div>
                  <div className="bg-info/5 rounded-xl p-6 border border-info/10">
                    <div className="text-3xl font-bold text-info mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support disponible</div>
                  </div>
                  <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/10">
                    <div className="text-3xl font-bold text-secondary mb-1">-50%</div>
                    <div className="text-sm text-gray-600">Économies moyennes</div>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-6 border border-accent/10">
                    <div className="text-3xl font-bold text-accent mb-1">N°1</div>
                    <div className="text-sm text-gray-600">Plateforme de confiance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}