'use client';

import { useAvatar } from '@/lib/hooks/useUsers';
import { useState } from 'react';
import { useToast } from '../common';
import { Avatar, Button, Modal, ModalFooter } from '../ui';
import InputFile from '../ui/InputFile';

export interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  userName?: string;
}

export default function UploadAvatarModal({
  isOpen,
  onClose,
  currentAvatar,
  userName
}: UploadAvatarModalProps) {
  const { uploadAvatar, deleteAvatar, isUploading } = useAvatar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const toast = useToast();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    try {
      await uploadAvatar(selectedFile);
      toast.success('Avatar mis à jour avec succès');
      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'upload');
    }
  };

  const handleDelete = async () => {
    if (!currentAvatar) {
      toast.error('Aucun avatar à supprimer');
      return;
    }

    if (!confirm('Voulez-vous vraiment supprimer votre avatar ?')) {
      return;
    }

    try {
      await deleteAvatar();
      toast.success('Avatar supprimé avec succès');
      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Modifier la photo de profil"
      size="md"
    >
      <div className="space-y-6">
        {/* Avatar actuel */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar
            src={preview || currentAvatar}
            alt={userName || 'Avatar'}
            fallback={userName}
            size="xl"
          />
          <p className="text-sm text-gray-500">
            {preview ? 'Aperçu de la nouvelle photo' : 'Photo actuelle'}
          </p>
        </div>

        {/* Input file */}
        <InputFile
          label="Choisir une nouvelle photo"
          showPreview={false}
          maxSize={5}
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
          onFileSelect={handleFileSelect}
          helperText="JPEG, PNG ou WebP • Maximum 5MB"
        />

        {/* Actions */}
        <ModalFooter className="flex-col sm:flex-row gap-2">
          {currentAvatar && !selectedFile && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isUploading}
              className="w-full sm:w-auto text-red-600 border-red-600 hover:bg-red-50"
            >
              Supprimer l&apos;avatar
            </Button>
          )}
          
          <div className="flex gap-2 w-full sm:w-auto ml-auto">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 sm:flex-none"
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              isLoading={isUploading}
              className="flex-1 sm:flex-none"
            >
              {isUploading ? 'Upload...' : 'Sauvegarder'}
            </Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}