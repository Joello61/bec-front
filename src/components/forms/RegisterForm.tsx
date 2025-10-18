'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus, Mail, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { ROUTES } from '@/lib/utils/constants';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  children?: React.ReactNode;
}

export default function RegisterForm({
  onSubmit,
  children,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center"
        >
          Créer un compte
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 text-center"
        >
          Rejoignez la communauté Co-Bage
        </motion.p>
      </div>

      {children}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            type="text"
            placeholder="Jean"
            error={errors.prenom?.message}
            leftIcon={<User className="w-5 h-5" />}
            {...register('prenom')}
            required
          />

          <Input
            label="Nom"
            type="text"
            placeholder="Dupont"
            error={errors.nom?.message}
            leftIcon={<User className="w-5 h-5" />}
            {...register('nom')}
            required
          />
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

        {/* ==================== TÉLÉPHONE RETIRÉ ==================== */}
        {/* Le téléphone sera demandé dans la page "Compléter profil" */}

        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          helperText="8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre"
          leftIcon={<Lock className="w-5 h-5" />}
          {...register('password')}
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
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="w-full cursor-pointer"
          >
            S&apos;inscrire
          </Button>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Déjà un compte ?
            </span>
          </div>
        </div>

        <Link href={ROUTES.LOGIN}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full"
          >
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
            >
              Se connecter
            </Button>
          </motion.div>
        </Link>
      </form>
    </div>
  );
}
