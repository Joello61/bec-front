'use client';

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateContact } from '@/lib/hooks/useContacts';
import { useEffect } from 'react';
import { CreateContactFormData, createContactSchema } from "@/lib/validations/contact.schema";
import { CONTACT } from "@/lib/utils/constants";

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

export function ContactSection() {
  const { createContact, isLoading, error, successMessage, clearError, clearSuccess } = useCreateContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateContactFormData>({
    resolver: zodResolver(createContactSchema),
  });

  // Reset form on success
  useEffect(() => {
    if (successMessage) {
      reset();
      const timer = setTimeout(() => {
        clearSuccess();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, reset, clearSuccess]);

  const onSubmit = async (data: CreateContactFormData) => {
    try {
      clearError();
      await createContact(data);
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: CONTACT.EMAIL,
      href: `mailto:${CONTACT.EMAIL}`
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Téléphone',
      value: CONTACT.PHONE,
      href: `tel:${CONTACT.PHONE}`
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Adresse',
      value: CONTACT.ADDRESS,
      href: null
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion ou besoin d&apos;aide ? Notre équipe est là pour vous répondre.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Informations de contact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-1 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600">{info.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Note sur rate limiting */}
            <motion.div
              variants={fadeIn}
              className="bg-info/10 border border-info/30 text-info-dark rounded-lg p-4"
            >
              <p className="text-sm">
                <strong>Note :</strong> Pour éviter les abus, l&apos;envoi de messages est limité à 5 par heure.
              </p>
            </motion.div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 shadow-md">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 bg-success/10 border border-success text-success px-4 py-3 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{successMessage}</p>
                    <p className="text-sm mt-1">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 bg-error/10 border border-error text-error px-4 py-3 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet <span className="text-error">*</span>
                  </label>
                  <input
                    {...register('nom')}
                    type="text"
                    id="nom"
                    className="input"
                    placeholder="Jean Dupont"
                    disabled={isLoading}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-error">{errors.nom.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="input"
                    placeholder="jean.dupont@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Sujet */}
              <div className="mb-6">
                <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet <span className="text-error">*</span>
                </label>
                <input
                  {...register('sujet')}
                  type="text"
                  id="sujet"
                  className="input"
                  placeholder="Question sur un voyage"
                  disabled={isLoading}
                />
                {errors.sujet && (
                  <p className="mt-1 text-sm text-error">{errors.sujet.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={6}
                  className="input resize-none"
                  placeholder="Décrivez votre demande..."
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-error">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}