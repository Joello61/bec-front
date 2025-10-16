'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  FileText,
  Shield,
  Package,
  Users,
  CreditCard,
  AlertCircle,
  ExternalLink,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { Card, Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
}

const categories: Category[] = [
  { id: 'general', name: 'Général', icon: HelpCircle, color: 'text-primary' },
  { id: 'voyage', name: 'Voyages', icon: Package, color: 'text-info' },
  { id: 'demande', name: 'Demandes', icon: FileText, color: 'text-warning' },
  { id: 'securite', name: 'Sécurité', icon: Shield, color: 'text-success' },
  {
    id: 'paiement',
    name: 'Paiement',
    icon: CreditCard,
    color: 'text-secondary',
  },
  { id: 'compte', name: 'Compte', icon: Users, color: 'text-error' },
];

const faqs: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'Comment fonctionne CoBage ?',
    answer:
      "CoBage met en relation des voyageurs avec des personnes souhaitant faire transporter des colis. Les voyageurs publient leurs trajets avec l'espace disponible, et les expéditeurs créent des demandes de transport. Les deux parties se mettent d'accord sur les modalités (rencontre, rémunération, etc.).",
  },
  {
    id: '2',
    category: 'general',
    question: 'Est-ce que CoBage est gratuit ?',
    answer:
      "Oui, la création de compte et la mise en relation sont entièrement gratuites. Aucun frais n'est prélevé par la plateforme. Les arrangements financiers se font directement entre le voyageur et l'expéditeur.",
  },
  {
    id: '3',
    category: 'voyage',
    question: 'Comment publier une annonce de voyage ?',
    answer:
      'Rendez-vous dans "Mes Voyages" puis cliquez sur "Nouveau voyage". Renseignez votre trajet (départ, arrivée, dates), l\'espace disponible, et publiez. Vous recevrez des notifications quand des demandes correspondantes sont disponibles.',
  },
  {
    id: '4',
    category: 'voyage',
    question: 'Que puis-je transporter ?',
    answer:
      'Vous pouvez transporter tout objet légal, non dangereux et non périssable. Les objets interdits incluent : armes, drogues, produits chimiques, animaux vivants, nourriture périssable. En cas de doute, refusez le transport.',
  },
  {
    id: '5',
    category: 'demande',
    question: 'Comment créer une demande de transport ?',
    answer:
      'Allez dans "Mes Demandes" et cliquez sur "Nouvelle demande". Indiquez ce que vous souhaitez faire transporter, le trajet, le poids estimé et la date limite. Les voyageurs correspondants seront notifiés.',
  },
  {
    id: '6',
    category: 'demande',
    question: 'Puis-je annuler une demande ?',
    answer:
      "Oui, vous pouvez annuler une demande tant qu'aucun voyageur ne l'a acceptée. Si un accord a été conclu, contactez le voyageur pour discuter de l'annulation.",
  },
  {
    id: '7',
    category: 'securite',
    question: "Comment vérifier l'identité d'un utilisateur ?",
    answer:
      "Vérifiez le profil de l'utilisateur : email vérifié, téléphone vérifié, nombre de voyages effectués, et les avis laissés par d'autres utilisateurs. Privilégiez les utilisateurs avec un profil complet et des avis positifs.",
  },
  {
    id: '8',
    category: 'securite',
    question: 'Que faire en cas de problème ?',
    answer:
      "Si vous rencontrez un problème (colis endommagé, utilisateur suspect, etc.), utilisez le système de signalement dans le profil de l'utilisateur concerné. Notre équipe examinera le signalement et prendra les mesures appropriées.",
  },
  {
    id: '9',
    category: 'securite',
    question: 'Quelles sont les règles de sécurité à respecter ?',
    answer:
      "Ne transportez jamais d'objets sans les avoir vérifiés. Rencontrez-vous dans des lieux publics. Ne partagez pas d'informations personnelles sensibles. Utilisez la messagerie de la plateforme pour communiquer. Signalez tout comportement suspect.",
  },
  {
    id: '10',
    category: 'paiement',
    question: 'Comment se passe le paiement ?',
    answer:
      "CoBage ne gère pas les paiements. Les arrangements financiers se font directement entre le voyageur et l'expéditeur. Nous recommandons de convenir du montant et du mode de paiement avant la remise du colis.",
  },
  {
    id: '11',
    category: 'paiement',
    question: 'Combien dois-je payer pour un transport ?',
    answer:
      "Le prix est libre et se négocie entre le voyageur et l'expéditeur. Il dépend généralement de la distance, du poids et de l'urgence. Soyez raisonnable et transparent dans vos tarifs.",
  },
  {
    id: '12',
    category: 'compte',
    question: 'Comment vérifier mon email et mon téléphone ?',
    answer:
      'Après inscription, vous recevrez un code à 6 chiffres par email. Entrez-le dans la section de vérification. Pour le téléphone, un SMS avec un code vous sera envoyé. Les comptes vérifiés inspirent plus confiance.',
  },
  {
    id: '13',
    category: 'compte',
    question: 'Puis-je modifier mon profil ?',
    answer:
      'Oui, rendez-vous dans "Mon Profil" pour modifier vos informations (nom, photo, bio, téléphone). Votre email ne peut être modifié pour des raisons de sécurité.',
  },
  {
    id: '14',
    category: 'compte',
    question: 'Comment supprimer mon compte ?',
    answer:
      "La suppression de compte n'est pas encore disponible depuis l'interface. Contactez-nous à contact@cobage.joeltech.dev avec votre demande et nous procéderons à la suppression dans les 48h.",
  },
];

export default function HelpPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Centre d&apos;aide
        </h1>
        <p className="text-gray-600">Trouvez des réponses à vos questions</p>
      </motion.div>

      {/* Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          type="text"
          placeholder="Rechercher une question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
          className="w-full"
        />
      </motion.div>

      {/* Catégories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.id)
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${category.color}`} />
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedCategory
            ? `${categories.find((c) => c.id === selectedCategory)?.name}`
            : 'Questions fréquentes'}
          {searchQuery &&
            ` (${filteredFAQs.length} résultat${
              filteredFAQs.length > 1 ? 's' : ''
            })`}
        </h2>

        {filteredFAQs.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              Aucune question ne correspond à votre recherche.
            </p>
          </Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id} className="overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))
        )}
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-info/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Vous n&apos;avez pas trouvé votre réponse ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre équipe est là pour vous aider. Contactez-nous par email.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:contact@cobage.joeltech.dev">
                  <Button
                    variant="primary"
                    leftIcon={<Mail className="w-4 h-4" />}
                  >
                    Nous contacter
                  </Button>
                </a>
                <Link href={ROUTES.CONTACT}>
                  <Button
                    variant="outline"
                    rightIcon={<ExternalLink className="w-4 h-4" />}
                  >
                    Page contact
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Liens utiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-3">Liens utiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href={ROUTES.TERMS}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    Conditions d&apos;utilisation
                  </p>
                  <p className="text-sm text-gray-500">
                    Nos règles et conditions
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href={ROUTES.PRIVACY}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    Politique de confidentialité
                  </p>
                  <p className="text-sm text-gray-500">
                    Comment nous protégeons vos données
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href={ROUTES.TRUST_SAFETY}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    Confiance et sécurité
                  </p>
                  <p className="text-sm text-gray-500">Conseils de sécurité</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href={ROUTES.HOW_IT_WORKS}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Comment ça marche</p>
                  <p className="text-sm text-gray-500">Guide complet</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
