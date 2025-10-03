'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <Input
        label="Mot de passe actuel"
        type={showCurrentPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
        required
        rightIcon={
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="hover:text-gray-700"
          >
            {showCurrentPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
      />

      <Input
        label="Nouveau mot de passe"
        type={showNewPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.newPassword?.message}
        helperText="8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre"
        {...register('newPassword')}
        required
        rightIcon={
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="hover:text-gray-700"
          >
            {showNewPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
      />

      <Input
        label="Confirmer le nouveau mot de passe"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.confirmNewPassword?.message}
        {...register('confirmNewPassword')}
        required
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
      />

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<Lock className="w-4 h-4" />}
          className="flex-1"
        >
          Changer le mot de passe
        </Button>
      </div>
    </form>
  );
}