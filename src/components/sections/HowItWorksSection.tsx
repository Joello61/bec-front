'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Package, 
  Star, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { Route } from 'next';

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
      staggerChildren: 0.1
    }
  }
};

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: 'Recherchez',
      description: 'Trouvez un voyageur allant vers votre destination ou une demande de transport correspondant à votre trajet.',
      forWho: 'Expéditeurs & Voyageurs',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      icon: MessageCircle,
      title: 'Contactez',
      description: 'Échangez directement via notre messagerie sécurisée pour convenir des détails du transport.',
      forWho: 'Tous',
      color: 'text-info',
      bgColor: 'bg-info/10',
      borderColor: 'border-info/20'
    },
    {
      icon: Package,
      title: 'Organisez',
      description: 'Convenez ensemble du lieu, de l\'heure et des modalités de remise du colis.',
      forWho: 'Tous',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    },
    {
      icon: Star,
      title: 'Évaluez',
      description: 'Après la livraison, laissez un avis pour renforcer la confiance dans la communauté.',
      forWho: 'Tous',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  const userTypes = [
    {
      title: 'Pour les Expéditeurs',
      description: 'Envoyez vos colis de manière économique',
      icon: Package,
      color: 'primary',
      steps: [
        'Créez une demande de transport',
        'Consultez les voyages disponibles',
        'Contactez le voyageur',
        'Remettez votre colis'
      ],
      cta: 'Créer une demande',
      href: '/auth/register' as Route
    },
    {
      title: 'Pour les Voyageurs',
      description: 'Rentabilisez votre espace bagages',
      icon: Search,
      color: 'secondary',
      steps: [
        'Publiez votre voyage',
        'Consultez les demandes',
        'Acceptez un transport',
        'Livrez et gagnez'
      ],
      cta: 'Publier un voyage',
      href: '/auth/register' as Route
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Processus simple
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Un processus simple en 4 étapes pour connecter voyageurs et expéditeurs
          </p>
        </motion.div>

        {/* Étapes générales */}
        <div className="relative mb-20">
          {/* Ligne de connexion (cachée sur mobile) */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                 <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    {/* Numéro de l'étape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                      {index + 1}
                    </div>
                    
                    {/* Icône */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${step.bgColor} rounded-2xl mb-4 mt-2 mx-auto`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                      {step.description}
                    </p>
                    
                    {/* Footer avec badge */}
                    <div className="mt-auto">
                      <span className={`inline-block text-xs font-medium ${step.color} ${step.bgColor} px-3 py-1.5 rounded-full border ${step.borderColor}`}>
                        {step.forWho}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Guides par type d'utilisateur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon;
            const colorClasses = {
              primary: {
                bg: 'bg-primary',
                text: 'text-primary',
                bgLight: 'bg-primary/5',
                border: 'border-primary/20'
              },
              secondary: {
                bg: 'bg-secondary',
                text: 'text-secondary',
                bgLight: 'bg-secondary/5',
                border: 'border-secondary/20'
              }
            }[userType.color];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                {/* Effet de glow */}
                <div className={`absolute inset-0 ${colorClasses?.bgLight} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                {/* Carte */}
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  {/* Header avec icône */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${colorClasses?.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {userType.title}
                      </h3>
                      <p className="text-gray-600">
                        {userType.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Liste des étapes */}
                  <ul className="space-y-3 mb-6">
                    {userType.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-success" />
                        </div>
                        <span className="text-gray-700 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <Link href={userType.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center gap-2 w-full px-6 py-3 ${colorClasses?.bg} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md`}
                    >
                      {userType.cta}
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}