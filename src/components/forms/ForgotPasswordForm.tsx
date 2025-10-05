'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { ROUTES } from '@/lib/utils/constants';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
}

export default function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="exemple@email.com"
        error={errors.email?.message}
        leftIcon={<Mail className="w-5 h-5" />}
        {...register('email')}
        required
      />

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full cursor-pointer"
        >
          Envoyer le lien
        </Button>
      </motion.div>

      <Link href={ROUTES.LOGIN}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full"
        >
          <Button
            type="button"
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="w-full cursor-pointer"
          >
            Retour à la connexion
          </Button>
        </motion.div>
      </Link>
    </form>
  );
}