'use client';

import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Mail, Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

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
      staggerChildren: 0.05
    }
  }
};

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Comment fonctionne CoBage ?',
      answer: 'CoBage met en relation des voyageurs disposant d\'espace dans leurs bagages avec des personnes souhaitant envoyer des colis. Les voyageurs publient leurs trajets, les expéditeurs créent des demandes, et ils se contactent directement pour organiser le transport.'
    },
    {
      question: 'La plateforme est-elle sécurisée ?',
      answer: 'Oui. Nous avons un système d\'évaluation qui permet de consulter les avis des utilisateurs. Nous recommandons de toujours vérifier le profil de votre interlocuteur et de privilégier les utilisateurs ayant de bonnes évaluations.'
    },
    {
      question: 'Comment se fait le paiement ?',
      answer: 'Le paiement se fait directement entre le voyageur et l\'expéditeur selon les modalités qu\'ils conviennent ensemble. CoBage facilite uniquement la mise en relation, sans gérer les transactions financières.'
    },
    {
      question: 'Quels types d\'objets peuvent être transportés ?',
      answer: 'Seuls les objets légaux, non dangereux et autorisés par les compagnies aériennes peuvent être transportés. Il est interdit de transporter des substances illicites, des armes, ou tout objet prohibé.'
    },
    {
      question: 'Que faire en cas de problème ?',
      answer: 'Si vous rencontrez un problème, vous pouvez signaler l\'utilisateur ou l\'annonce via notre système de signalement. Notre équipe examinera la situation et prendra les mesures appropriées.'
    },
    {
      question: 'Comment évaluer un utilisateur ?',
      answer: 'Après une transaction réussie, vous pouvez laisser un avis sur le profil de l\'utilisateur. Cela aide la communauté à identifier les membres fiables et sérieux.'
    },
    {
      question: 'L\'inscription est-elle gratuite ?',
      answer: 'Oui, l\'inscription et l\'utilisation de la plateforme sont entièrement gratuites. Vous ne payez que pour le transport de votre colis, directement au voyageur.'
    },
    {
      question: 'Puis-je annuler une demande ou un voyage ?',
      answer: 'Oui, vous pouvez annuler vos annonces à tout moment depuis votre tableau de bord. Nous vous recommandons toutefois de prévenir les personnes avec qui vous étiez en contact.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/90 backdrop-blur-sm rounded-full text-gray-900 font-bold mb-8">
            <HelpCircle className="w-5 h-5" />
            Des questions ?
          </div> 
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Tout ce que vous devez savoir sur CoBage
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-4 mb-12"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-lg">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="minus"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Minus className="w-5 h-5 text-primary" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="plus"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Plus className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative overflow-hidden"
        >
          {/* Décorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative bg-white border border-gray-200 rounded-2xl p-8 md:p-10 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Encore des questions ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Notre équipe est là pour vous aider. N&apos;hésitez pas à nous contacter pour toute question supplémentaire.
            </p>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-md"
              >
                <Mail className="w-5 h-5" />
                Contactez-nous
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}