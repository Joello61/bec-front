'use client';

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

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

export function TermsSection() {
  const sections = [
    {
      title: '1. Acceptation des conditions',
      content: 'En utilisant Bagage Express, vous acceptez d\'être lié par ces conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.'
    },
    {
      title: '2. Description du service',
      content: 'Bagage Express est une plateforme de mise en relation entre voyageurs et expéditeurs. Nous ne gérons pas directement les transactions, les paiements ni les livraisons.'
    },
    {
      title: '3. Responsabilités de l\'utilisateur',
      content: 'Vous êtes responsable de l\'exactitude des informations que vous fournissez et de vos interactions avec les autres utilisateurs. Vous devez respecter les lois en vigueur concernant le transport d\'objets.'
    },
    {
      title: '4. Objets interdits',
      content: 'Il est strictement interdit de transporter des substances illégales, des armes, des objets dangereux ou tout article prohibé par les compagnies aériennes et les réglementations douanières.'
    },
    {
      title: '5. Limitation de responsabilité',
      content: 'Bagage Express n\'est pas responsable des pertes, dommages ou problèmes survenant lors du transport. Les transactions se font aux risques des utilisateurs.'
    },
    {
      title: '6. Résiliation',
      content: 'Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions ou de comportement inapproprié.'
    }
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
            <FileText className="w-10 h-10 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Conditions d&apos;utilisation
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
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
          transition={{ delay: 0.3 }}
          className="mt-12 bg-primary/5 rounded-lg p-6 border-l-4 border-primary"
        >
          <p className="text-gray-700">
            Pour toute question concernant ces conditions, veuillez nous contacter à{' '}
            <a href="mailto:legal@bagage-express.cm" className="text-primary font-medium hover:underline">
              legal@bagage-express.cm
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}