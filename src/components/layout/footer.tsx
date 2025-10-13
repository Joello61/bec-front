'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import { ROUTES, CONTACT } from '@/lib/utils/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { name: 'Voyages', href: ROUTES.MES_VOYAGES },
      { name: 'Demandes', href: ROUTES.MES_DEMANDES },
      { name: 'Comment ça marche', href: ROUTES.HOW_IT_WORKS },
    ],
    legal: [
      { name: 'Conditions d\'utilisation', href: ROUTES.TERMS },
      { name: 'Politique de confidentialité', href: ROUTES.PRIVACY },
      { name: 'Sécurité', href: ROUTES.TRUST_SAFETY },
    ],
    support: [
      { name: 'Contact', href: ROUTES.CONTACT },
      { name: 'FAQ', href: ROUTES.FAQ },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: 'hover:text-[#1877F2]' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-[#1DA1F2]' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: 'hover:text-[#E4405F]' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">

      <div className="relative container-custom py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Link href={ROUTES.HOME} className="flex items-center gap-3">
                  <div className="relative h-14 w-28 flex-shrink-0">
                    <Image
                      src="/images/logo/logo-1.png"
                      alt="Co-Bage - Le monde à portée de bagage"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
              </motion.div>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Connectez voyageurs et expéditeurs pour un transport sûr et économique de colis entre le Cameroun et le monde.
            </p>
            
            {/* Social Links avec animations */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center transition-all ${social.color} hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Platform Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Plateforme
            </h3>
            <ul className="space-y-3">
              {links.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring' as const, stiffness: 400 }}
                    >
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-secondary rounded-full" />
              Légal
            </h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring' as const, stiffness: 400 }}
                    >
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-accent rounded-full" />
              Support
            </h3>
            <ul className="space-y-3 mb-6">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring' as const, stiffness: 400 }}
                    >
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info avec icônes */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <Link
                href={`mailto:${CONTACT.EMAIL}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs">{CONTACT.EMAIL}</span>
              </Link>
              <Link 
                href={`tel:${CONTACT.PHONE}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-xs">{CONTACT.PHONE}</span>
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-400">{CONTACT.ADDRESS}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section avec séparateur élégant */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear}  CoBage. Tous droits réservés.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <span>Fait avec</span>
              <span className="text-error">
                <Heart strokeWidth={3} className='w-4 h-4'/>
              </span>
              <span>au Cameroun</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}