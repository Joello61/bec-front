'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal } from '@/components/ui';
import { createAvisSchema, type CreateAvisFormData } from '@/lib/validations';
import { StarRating } from '../avis';

interface AvisFormProps {
  isOpen: boolean;
  onClose: () => void;
  cibleId: number;
  cibleNom: string; // Pour afficher le nom dans le titre
  voyageId?: number;
  onSubmit: (data: CreateAvisFormData) => Promise<void>;
}

export default function AvisForm({ 
  isOpen, 
  onClose, 
  cibleId, 
  cibleNom,
  voyageId, 
  onSubmit 
}: AvisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateAvisFormData>({
    resolver: zodResolver(createAvisSchema),
    defaultValues: {
      cibleId,
      voyageId,
      note: 0,
      commentaire: '',
    },
  });

  const note = watch('note');

  const handleFormSubmit = async (data: CreateAvisFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Laisser un avis pour ${cibleNom}`}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Note <span className="text-error">*</span>
          </label>
          <div className="flex justify-center">
            <StarRating
              rating={note}
              interactive
              size="lg"
              onChange={(rating) => setValue('note', rating)}
            />
          </div>
          {errors.note && (
            <p className="mt-2 text-sm text-error text-center">{errors.note.message}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire
          </label>
          <textarea
            id="commentaire"
            rows={5}
            className="input"
            placeholder="Partagez votre expérience avec ce voyageur..."
            {...register('commentaire')}
          />
          {errors.commentaire && (
            <p className="mt-1 text-sm text-error">{errors.commentaire.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Optionnel - Décrivez votre expérience
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isSubmitting} 
            className="flex-1"
          >
            Publier l&apos;avis
          </Button>
        </div>
      </form>
    </Modal>
  );
}