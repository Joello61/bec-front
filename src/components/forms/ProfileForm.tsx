'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { updateUserSchema, type UpdateUserFormData } from '@/lib/validations';
import type { User } from '@/types';
import { useAvatar } from '@/lib/hooks/useUsers';
import AvatarUploadField from './AvatarUploadField';
import { logger } from '@/lib/utils/logger';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ProfileForm({ user, onSubmit, onCancel }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    uploadAvatar, 
    deleteAvatar,
    isUploading, 
    error: uploadError,
    clearError,
    currentAvatar 
  } = useAvatar();

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
    },
  });

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Si un nouveau fichier a été sélectionné, on l'upload en premier
      if (selectedFile) {
        try {
          await uploadAvatar(selectedFile);
          // L'avatar est maintenant uploadé et le store est mis à jour
        } catch (error) {
          logger.error('Erreur lors de l\'upload de l\'avatar:', error);
          // On continue quand même avec la mise à jour du profil
        }
      }

      // 2. Ensuite on met à jour le profil (sans la photo)
      await onSubmit(data);

      // Réinitialiser le fichier sélectionné après succès
      setSelectedFile(null);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    clearError();
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setSelectedFile(null);
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'avatar:', error);
    }
  };

  const isProcessing = isSubmitting || isUploading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Photo de profil */}
      <AvatarUploadField
        label="Photo de profil"
        fallbackName={`${user.nom} ${user.prenom}`}
        currentAvatar={currentAvatar}
        selectedFile={selectedFile}
        uploadError={uploadError}
        isProcessing={isProcessing}
        onFileSelect={handleFileSelect}
        onDeleteAvatar={handleDeleteAvatar}
      />

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          type="text"
          placeholder="Jean"
          error={errors.prenom?.message}
          disabled={isProcessing}
          {...register('prenom')}
        />

        <Input
          label="Nom"
          type="text"
          placeholder="Dupont"
          error={errors.nom?.message}
          disabled={isProcessing}
          {...register('nom')}
        />
      </div>

      <Input
        label="Téléphone"
        type="tel"
        placeholder="+237 6XX XX XX XX"
        error={errors.telephone?.message}
        helperText="Format: +237XXXXXXXXX"
        disabled={isProcessing}
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
          disabled={isProcessing}
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
            disabled={isProcessing}
            className="flex-1"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isProcessing}
          leftIcon={<Save className="w-4 h-4" />}
          className="flex-1"
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
}