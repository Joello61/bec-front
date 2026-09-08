'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Plane } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

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

export function CtaSection() {
  return (
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

            <Link href={ROUTES.PUBLIC_EXPLORE}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 transition-colors text-lg"
              >
                Voir les voyages et demandes
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
