'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { ROUTES } from '@/lib/utils/constants';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        placeholder="exemple@email.com"
        error={errors.email?.message}
        leftIcon={<Mail className="w-5 h-5" />}
        {...register('email')}
        required
      />

      <div>
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
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
        <div className="mt-3 text-right">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-primary hover:text-primary-dark transition-colors font-medium"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<LogIn className="w-4 h-4" />}
          className="w-full cursor-pointer"
        >
          Se connecter
        </Button>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">
            Pas encore de compte ?
          </span>
        </div>
      </div>

      <Link href={ROUTES.REGISTER}>
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
            Créer un compte
          </Button>
        </motion.div>
      </Link>
    </form>
  );
}