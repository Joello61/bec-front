import { Trash2 } from 'lucide-react';
import { Button, Avatar } from '@/components/ui';
import InputFile from '@/components/ui/InputFile';

interface AvatarUploadFieldProps {
  label: string;
  fallbackName: string;
  currentAvatar: string | null;
  selectedFile: File | null;
  uploadError?: string | null;
  isProcessing: boolean;
  onFileSelect: (file: File | null) => void;
  onDeleteAvatar: () => void;
}

export default function AvatarUploadField({
  label,
  fallbackName,
  currentAvatar,
  selectedFile,
  uploadError,
  isProcessing,
  onFileSelect,
  onDeleteAvatar,
}: AvatarUploadFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="flex items-start gap-4">
        <Avatar
          src={currentAvatar || undefined}
          fallback={fallbackName}
          size="xl"
        />
        <div className="flex-1 space-y-2">
          <InputFile
            onFileSelect={onFileSelect}
            error={uploadError || undefined}
            helperText="Formats acceptés: JPG, PNG, WEBP (max 5MB)"
            maxSize={5}
            acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
            showPreview={true}
            disabled={isProcessing}
          />
          {currentAvatar && !selectedFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDeleteAvatar}
              disabled={isProcessing}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Supprimer la photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
