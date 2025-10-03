'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Camera } from 'lucide-react';
import { Button, Input, Avatar } from '@/components/ui';
import { updateUserSchema, type UpdateUserFormData } from '@/lib/validations';
import type { User } from '@/types';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ProfileForm({ user, onSubmit, onCancel }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user.photo || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone || '',
      bio: user.bio || '',
      photo: user.photo || '',
    },
  });

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Photo de profil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Photo de profil
        </label>
        <div className="flex items-center gap-4">
          <Avatar
            src={photoPreview || undefined}
            fallback={`${user.nom} ${user.prenom}`}
            size="xl"
          />
          <div className="flex-1">
            <Input
              type="url"
              placeholder="https://exemple.com/photo.jpg"
              error={errors.photo?.message}
              helperText="URL de votre photo de profil"
              {...register('photo')}
              onChange={(e) => {
                register('photo').onChange(e);
                setPhotoPreview(e.target.value);
              }}
              leftIcon={<Camera className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          type="text"
          placeholder="Jean"
          error={errors.prenom?.message}
          {...register('prenom')}
        />

        <Input
          label="Nom"
          type="text"
          placeholder="Dupont"
          error={errors.nom?.message}
          {...register('nom')}
        />
      </div>

      <Input
        label="Téléphone"
        type="tel"
        placeholder="+237 6XX XX XX XX"
        error={errors.telephone?.message}
        helperText="Format: +237XXXXXXXXX"
        {...register('telephone')}
      />

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          className="input"
          placeholder="Parlez un peu de vous..."
          {...register('bio')}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-error">{errors.bio.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Maximum 500 caractères
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
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
          leftIcon={<Save className="w-4 h-4" />}
          className="flex-1"
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
}