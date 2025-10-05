'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
}

export default function ResetPasswordForm({ token, onSubmit }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
    },
  });

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
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
        <h2 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </p>
      </div>

      <input type="hidden" {...register('token')} />

      <Input
        label="Nouveau mot de passe"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.newPassword?.message}
        helperText="8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre"
        leftIcon={<Lock className="w-5 h-5" />}
        {...register('newPassword')}
        required
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-gray-700 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
      />

      <Input
        label="Confirmer le mot de passe"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        leftIcon={<Lock className="w-5 h-5" />}
        {...register('confirmPassword')}
        required
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="hover:text-gray-700 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
      />

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full cursor-pointer"
        >
          Réinitialiser le mot de passe
        </Button>
      </motion.div>
    </form>
  );
}