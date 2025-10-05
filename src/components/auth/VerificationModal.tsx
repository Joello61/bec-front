/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Smartphone, RefreshCw } from 'lucide-react';
import { Modal, ModalFooter, Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { useToast } from '@/components/common';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'email' | 'phone';
  contactInfo?: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  type,
  contactInfo
}: VerificationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const toast = useToast();
  const { verifyEmail, verifyPhone, resendVerification } = useAuth();

  const Icon = type === 'email' ? Mail : Smartphone;
  const title = type === 'email' ? 'Vérification de l\'email' : 'Vérification du téléphone';
  const description = type === 'email' 
    ? `Un code à 6 chiffres a été envoyé à ${contactInfo || 'votre email'}`
    : `Un code à 6 chiffres a été envoyé par SMS au ${contactInfo || 'votre numéro'}`;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      toast.error('Veuillez entrer les 6 chiffres');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (type === 'email') {
        await verifyEmail(fullCode);
        toast.success('Email vérifié avec succès !');
      } else {
        await verifyPhone(fullCode);
        toast.success('Téléphone vérifié avec succès !');
      }
      
      onClose();
      setCode(['', '', '', '', '', '']);
    } catch (error: any) {
      toast.error(error.message || 'Code invalide');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setCanResend(false);
    setCountdown(60);
    
    try {
      await resendVerification(type);
      toast.success('Code renvoyé avec succès !');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du renvoi');
      setCanResend(true);
      setCountdown(0);
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        </div>

        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
        {code.map((digit, index) => (
            <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isSubmitting}
            />
        ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">
            Vous n&apos;avez pas reçu le code ?
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || isResending}
            className="text-primary hover:text-primary-dark font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Envoi en cours...' : canResend ? 'Renvoyer le code' : `Renvoyer dans ${countdown}s`}
          </button>
        </div>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isCodeComplete}
            isLoading={isSubmitting}
            className="flex-1"
          >
            Vérifier
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}