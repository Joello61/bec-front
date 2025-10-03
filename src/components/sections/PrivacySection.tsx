'use client';

import { motion } from "framer-motion";
import { Eye, Shield, Users, CheckCircle, Lock } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function PrivacySection() {
  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Données collectées',
      content: 'Nous collectons les informations que vous nous fournissez lors de l\'inscription : nom, prénom, email, téléphone, et les informations de profil que vous choisissez de partager.'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Utilisation des données',
      content: 'Vos données sont utilisées pour faciliter la mise en relation entre utilisateurs, améliorer nos services et assurer la sécurité de la plateforme.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Protection des données',
      content: 'Nous utilisons des mesures de sécurité standards pour protéger vos informations personnelles. Vos données ne sont jamais vendues à des tiers.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Partage d\'informations',
      content: 'Vos informations de contact ne sont partagées qu\'avec les utilisateurs avec qui vous choisissez d\'interagir sur la plateforme.'
    }
  ];

  const rights = [
    'Accéder à vos données personnelles',
    'Modifier ou corriger vos informations',
    'Supprimer votre compte et vos données',
    'Exporter vos données',
    'Retirer votre consentement'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Politique de confidentialité
            </h2>
          </div>
          <p className="text-gray-600">
            Dernière mise à jour : Janvier 2025
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                {section.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-primary/5 rounded-lg p-8 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Vos droits
          </h3>
          <p className="text-gray-600 mb-4">
            Conformément au RGPD et aux lois camerounaises sur la protection des données, vous disposez des droits suivants :
          </p>
          <ul className="space-y-2">
            {rights.map((right, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{right}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Cookies
          </h3>
          <p className="text-gray-600 mb-4">
            Notre site utilise des cookies essentiels pour assurer le bon fonctionnement de la plateforme et maintenir votre session connectée. Nous n&apos;utilisons pas de cookies publicitaires ou de tracking tiers.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            Contact
          </h3>
          <p className="text-gray-600">
            Pour toute question relative à la protection de vos données, contactez-nous à{' '}
            <a href="mailto:privacy@bagage-express.cm" className="text-primary font-medium hover:underline">
              privacy@bagage-express.cm
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}