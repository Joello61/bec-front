'use client';

import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { ROUTES, CONTACT } from '@/lib/utils/constants';
import { usePathname } from 'next/navigation';
import { CookiePreferencesButton } from '../common/CookiesConsent';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isAuthPage = pathname?.includes('/auth');
  const isAdminPage = pathname?.includes('/admin');
  const isDashboardPage = pathname?.includes('/dashboard');

  const links = {
    platform: [
      { name: 'Accueil', href: ROUTES.HOME },
      { name: 'À propos', href: ROUTES.ABOUT },
      { name: 'Comment ça marche', href: ROUTES.HOW_IT_WORKS },
    ],
    legal: [
      { name: "Conditions d'utilisation", href: ROUTES.TERMS },
      { name: 'Confidentialité', href: ROUTES.PRIVACY },
      { name: 'Sécurité', href: ROUTES.TRUST_SAFETY },
      { name: 'Cookies', href: ROUTES.COOKIES },
    ],
    support: [
      { name: 'Contact', href: ROUTES.CONTACT },
      { name: 'FAQ', href: ROUTES.FAQ },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', image: '/images/social/facebook.png', href: 'https://www.facebook.com/cobageOfficiel' },
    { name: 'X', image: '/images/social/x.svg', href: 'https://x.com/cobage_officiel' },
    { name: 'Instagram', image: '/images/social/instagram.png', href: 'https://www.instagram.com/cobage_officiel' },
    { name: 'LinkedIn', image: '/images/social/linkedin.png', href: 'https://www.linkedin.com/company/cobage-officiel' },
  ];

  if (isAuthPage || isDashboardPage || isAdminPage) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-6 lg:py-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href={ROUTES.HOME} className="inline-block mb-4">
              <div className="relative h-12 w-24">
                <Image
                  src="/images/logo/logo-1.png"
                  alt="CoBage"
                  priority
                  className="object-contain"
                  width={96}
                  height={48}
                />
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Le monde à portée de bagages. Transport collaboratif entre le Cameroun et le monde.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex gap-4">
              <a
                href={socialLinks[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 transition-transform duration-200 hover:scale-110"
                aria-label={socialLinks[0].name}
              >
                <Image
                  src={socialLinks[0].image}
                  alt={socialLinks[0].name}
                  width={20}
                  height={20}
                  className="w-7 h-7"
                />
              </a>

              <a
                href={socialLinks[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex justify-center items-center rounded-md bg-black transition-transform duration-200 hover:scale-110"
                aria-label={socialLinks[1].name}
              >
                <Image
                  src={socialLinks[1].image}
                  alt={socialLinks[1].name}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </a>

              <a
                href={socialLinks[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 transition-transform duration-200 hover:scale-110"
                aria-label={socialLinks[2].name}
              >
                <Image
                  src={socialLinks[2].image}
                  alt={socialLinks[2].name}
                  width={20}
                  height={20}
                  className="w-7 h-7"
                />
              </a>

              <a
                href={socialLinks[3].href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-7 transition-transform duration-200 hover:scale-110"
                aria-label={socialLinks[3].name}
              >
                <Image
                  src={socialLinks[3].image}
                  alt={socialLinks[3].name}
                  width={20}
                  height={20}
                  className="w-8 h-7"
                />
              </a>
            </div>
          </div>

          {/* Plateforme */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Plateforme
            </h3>
            <ul className="space-y-3">
              {links.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Support
            </h3>
            <ul className="space-y-3 mb-6">
              {links.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact rapide */}
            <div className="space-y-2">
              <a
                href={`mailto:${CONTACT.EMAIL}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">{CONTACT.EMAIL}</span>
              </a>
              <a
                href={`tel:${CONTACT.PHONE}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">{CONTACT.PHONE}</span>
              </a>
            </div>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Légal
            </h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CookiePreferencesButton />

        {/* Séparateur */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear} CoBage. Tous droits réservés.
            </p>

            {/* From JoelTech */}
            <div className="text-sm text-gray-400">
              <span className="text-xs">from</span>{' '}
              <span className="font-semibold text-gray-600">JoelTech</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}