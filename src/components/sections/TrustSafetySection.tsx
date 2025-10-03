'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  UserCheck, 
  MessageSquare, 
  Eye, 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  XCircle,
  Package
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
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export function TrustSafetySection() {
  const safetyTips = [
    {
      icon: UserCheck,
      title: 'Vérifiez les profils',
      description: 'Consultez les évaluations et les avis laissés par d\'autres utilisateurs avant d\'engager une transaction.',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: MessageSquare,
      title: 'Communiquez sur la plateforme',
      description: 'Gardez vos échanges sur notre messagerie pour avoir une trace en cas de litige.',
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      icon: Eye,
      title: 'Inspectez les colis',
      description: 'Vérifiez toujours le contenu du colis avant de l\'accepter pour le transport.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: AlertTriangle,
      title: 'Signalez les comportements suspects',
      description: 'N\'hésitez pas à signaler tout comportement inapproprié ou suspect à notre équipe.',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const prohibitedItems = [
    'Substances illicites et stupéfiants',
    'Armes et munitions',
    'Produits explosifs ou inflammables',
    'Contrefaçons et articles de contrebande',
    'Animaux vivants',
    'Objets de valeur non déclarés (bijoux, argent liquide)'
  ];

  const bestPractices = [
    {
      title: 'Pour les expéditeurs',
      icon: Package,
      tips: [
        'Emballez soigneusement vos colis',
        'Fournissez une description précise du contenu',
        'Convenez d\'un prix raisonnable avec le voyageur',
        'Remettez le colis en main propre',
        'Gardez une preuve de remise'
      ]
    },
    {
      title: 'Pour les voyageurs',
      icon: UserCheck,
      tips: [
        'N\'acceptez que des colis dont vous connaissez le contenu',
        'Refusez les colis suspects ou mal emballés',
        'Vérifiez que le poids respecte vos limites bagages',
        'Assurez-vous d\'avoir les documents nécessaires',
        'Livrez en main propre au destinataire'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Confiance et Sécurité
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Votre sécurité est notre priorité. Suivez ces recommandations pour des transactions sereines.
          </p>
        </motion.div>

        {/* Conseils de sécurité */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {safetyTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-50 rounded-2xl p-6 text-center border border-gray-200 hover:shadow-md transition-shadow h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${tip.bgColor} rounded-xl mb-4`}>
                    <Icon className={`w-7 h-7 ${tip.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Objets interdits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                <XCircle className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Objets interdits
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Le transport des articles suivants est strictement interdit :
            </p>
            <ul className="space-y-3 mb-6">
              {prohibitedItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="w-3 h-3 text-error" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-error/5 rounded-xl border-l-4 border-error">
              <p className="text-sm text-gray-700">
                <strong className="text-error">Important :</strong> Le non-respect de ces règles peut entraîner des poursuites légales et la suspension définitive de votre compte.
              </p>
            </div>
          </motion.div>

          {/* Bonnes pratiques */}
          <div className="space-y-6">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {practice.title}
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {practice.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600 text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Système d'évaluation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden"
        >
          {/* Décorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-warning/10 rounded-xl mb-4">
                <Star className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Système d&apos;évaluation
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Les avis et évaluations sont au cœur de la confiance dans notre communauté.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="text-3xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-sm text-gray-600 font-medium">Privilégiez les utilisateurs avec de bonnes notes</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="text-3xl mb-3">💬</div>
                <p className="text-sm text-gray-600 font-medium">Lisez les commentaires laissés par d&apos;autres</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="text-3xl mb-3">✓</div>
                <p className="text-sm text-gray-600 font-medium">Laissez votre avis après chaque transaction</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 text-center border border-primary/10">
              <p className="text-gray-700 mb-4 font-medium">
                Un problème ou une question concernant la sécurité ?
              </p>
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-md"
                >
                  Contactez notre équipe
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}