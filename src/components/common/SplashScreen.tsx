'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  visible: boolean;
  onComplete?: () => void;
}

const loadingSteps = [
  { progress: 0, text: 'Initialisation...' },
  { progress: 33, text: 'Chargement des voyages...' },
  { progress: 66, text: 'Chargement des demandes...' },
  { progress: 100, text: 'Chargement du dashboard...' },
];

export default function SplashScreen({ visible, onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      containerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  // Progression automatique des étapes
  useEffect(() => {
    if (!visible) return;

    const stepDuration = shouldReduceMotion ? 300 : 500; // 500ms par étape
    const intervals: NodeJS.Timeout[] = [];

    loadingSteps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, index * stepDuration);
      intervals.push(timer);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [visible, shouldReduceMotion]);

  const handleExitComplete = () => {
    onComplete?.();
  };

  const currentProgress = loadingSteps[currentStep]?.progress || 0;
  const currentText = loadingSteps[currentStep]?.text || 'Chargement...';

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          ref={containerRef}
          key="splash"
          role="dialog"
          aria-label="Écran de chargement CoBage"
          aria-live="polite"
          tabIndex={-1}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeOut' },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#00695c]"
        >
          {/* Section principale : Logo + Titre + Slogan */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: shouldReduceMotion ? 1 : 1.1, opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="mb-6"
            >
              <Image
                src="/images/logo/logo_blanc.png"
                alt="Logo CoBage"
                width={100}
                height={100}
                priority
                className="select-none"
              />
            </motion.div>

            {/* Nom de l'app */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.2,
                duration: 0.4,
              }}
              className="text-5xl font-bold text-white mb-3 tracking-tight"
            >
              CoBage
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.3,
                duration: 0.4,
              }}
              className="text-base text-white/90 font-medium text-center"
            >
              Le monde à portée de bagages
            </motion.p>

            {/* Barre de progression */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.5,
                duration: 0.4,
              }}
              className="mt-12 w-full max-w-xs"
            >
              {/* Barre de fond */}
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{
                    duration: shouldReduceMotion ? 0.2 : 0.5,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {/* Texte de chargement dynamique */}
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="mt-3 text-sm text-white/80 text-center font-medium"
              >
                {currentText}
              </motion.p>
            </motion.div>
          </div>

          {/* Footer "from JoelTech" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.4,
              duration: 0.4,
            }}
            className="pb-10 flex flex-col items-center gap-2"
          >
            <p className="text-white/50 text-xs font-normal">from</p>
            <p className="text-white text-lg font-semibold tracking-tight">JoelTech</p>
          </motion.div>

          {/* Texte caché pour lecteurs d'écran */}
          <div className="sr-only" role="status" aria-live="polite">
            {currentText}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}