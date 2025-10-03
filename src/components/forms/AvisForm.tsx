'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui';
import { createAvisSchema, type CreateAvisFormData } from '@/lib/validations';
import { StarRating } from '../avis';

interface AvisFormProps {
  cibleId: number;
  voyageId?: number;
  onSubmit: (data: CreateAvisFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function AvisForm({ cibleId, voyageId, onSubmit, onCancel }: AvisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note <span className="text-error">*</span>
        </label>
        <StarRating
          rating={note}
          interactive
          size="lg"
          onChange={(rating) => setValue('note', rating)}
        />
        {errors.note && (
          <p className="mt-1 text-sm text-error">{errors.note.message}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700 mb-2">
          Commentaire
        </label>
        <textarea
          id="commentaire"
          rows={4}
          className="input"
          placeholder="Partagez votre expérience..."
          {...register('commentaire')}
        />
        {errors.commentaire && (
          <p className="mt-1 text-sm text-error">{errors.commentaire.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
          Publier l&apos;avis
        </Button>
      </div>
    </form>
  );
}