'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { useToast } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function VerifyEmailPageClient() {
  const router = useRouter();
  const { verifyEmail, resendVerification, pendingEmail, user } = useAuth();
  const toast = useToast();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email à vérifier (depuis pendingEmail ou user.email si déjà connecté)
  const emailToVerify = pendingEmail || user?.email;

  useEffect(() => {
    // Si pas d'email, rediriger vers register
    if (!emailToVerify) {
      router.push(ROUTES.REGISTER);
    }
  }, [emailToVerify, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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

  // ==================== SUBMIT AVEC AUTHENTIFICATION ====================
  const handleSubmit = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      toast.error('Veuillez entrer les 6 chiffres');
      return;
    }

    if (!emailToVerify) {
      toast.error('Email manquant');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Vérifier l'email (backend retourne JWT + user)
      await verifyEmail(fullCode, emailToVerify);
      
      toast.success('Email vérifié avec succès !');
      
      // ==================== VÉRIFIER SI PROFIL COMPLET ====================
      
      if (!user?.isProfileComplete) {
        // Profil incomplet → Complete profile
        setTimeout(() => {
          router.push(ROUTES.COMPLETE_PROFILE);
        }, 1000);
      } else {
        // Profil complet → Dashboard
        setTimeout(() => {
          router.push(ROUTES.EXPLORE);
        }, 1000);
      }
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Code invalide');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!emailToVerify) {
      toast.error('Email manquant');
      return;
    }

    setIsResending(true);
    setCanResend(false);
    setCountdown(60);
    
    try {
      await resendVerification('email', emailToVerify);
      toast.success('Code renvoyé avec succès !');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du renvoi');
      setCanResend(true);
      setCountdown(0);
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  if (!emailToVerify) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Vérifiez votre email
            </h1>
            <p className="text-gray-600 text-sm">
              Un code à 6 chiffres a été envoyé à<br />
              <span className="font-semibold text-primary">{emailToVerify}</span>
            </p>
          </div>

          {/* Code Input */}
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
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                disabled={isSubmitting}
              />
            ))}
          </div>

          {/* Resend */}
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

          {/* Submit Button */}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isCodeComplete}
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full"
          >
            Vérifier et continuer
          </Button>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Le code expire dans 15 minutes
          </p>
        </div>
      </motion.div>
    </div>
  );
}