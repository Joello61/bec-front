'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  title = 'Une erreur est survenue',
  message = 'Impossible de charger les données. Veuillez réessayer.',
  onRetry 
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-12 px-4"
    >
      <div className="w-24 h-24 mb-6 rounded-full bg-error/10 flex items-center justify-center">
        <AlertCircle className="w-16 h-16 text-error" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Réessayer
        </Button>
      )}
    </motion.div>
  );
}