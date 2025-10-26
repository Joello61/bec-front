'use client';

import { InputHTMLAttributes, forwardRef, useState, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';

export interface InputFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  showPreview?: boolean;
  maxSize?: number;
  acceptedFormats?: string[];
  onFileSelect?: (file: File | null) => void;
}

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showPreview = true,
      maxSize = 5,
      acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
      onFileSelect,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [localError, setLocalError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'file-input';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setLocalError('');

      if (!file) {
        setPreview(null);
        setFileName('');
        onFileSelect?.(null);
        onChange?.(e);
        return;
      }

      // Validation de la taille
      if (file.size > maxSize * 1024 * 1024) {
        setLocalError(`Le fichier est trop volumineux (max ${maxSize}MB)`);
        setPreview(null);
        setFileName('');
        onFileSelect?.(null);
        return;
      }

      // Validation du format
      if (!acceptedFormats.includes(file.type)) {
        setLocalError(`Format non supporté. Formats acceptés : ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`);
        setPreview(null);
        setFileName('');
        onFileSelect?.(null);
        return;
      }

      setFileName(file.name);

      // Générer la preview si c'est une image
      if (file.type.startsWith('image/') && showPreview) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      onFileSelect?.(file);
      onChange?.(e);
    };

    const handleRemove = () => {
      setPreview(null);
      setFileName('');
      setLocalError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onFileSelect?.(null);
    };

    const displayError = error || localError;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="space-y-3">
          {/* Zone de preview */}
          {showPreview && preview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition"
                title="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Input file caché */}
          <input
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            type="file"
            id={inputId}
            accept={acceptedFormats.join(',')}
            onChange={handleFileChange}
            className="hidden"
            {...props}
          />

          {/* Bouton de sélection */}
          <label
            htmlFor={inputId}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition',
              displayError
                ? 'border-error bg-error/5 hover:bg-error/10'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium text-gray-600">
              {fileName || 'Choisir un fichier'}
            </span>
          </label>

          {/* Nom du fichier sélectionné (si pas de preview) */}
          {!showPreview && fileName && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700 truncate flex-1">{fileName}</span>
              <button
                type="button"
                onClick={handleRemove}
                className="ml-2 text-red-500 hover:text-red-600 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Messages d'erreur et helper */}
        {displayError && (
          <p className="mt-2 text-sm text-error">{displayError}</p>
        )}

        {!displayError && helperText && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

InputFile.displayName = 'InputFile';

export default InputFile;