'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log l'erreur pour le monitoring
    console.error('Error caught by error boundary:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon d'erreur */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.2, 
              type: 'spring', 
              stiffness: 200,
              damping: 15
            }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  repeatDelay: 2
                }}
                className="p-6 rounded-full bg-accent/10"
              >
                <AlertTriangle className="h-24 w-24 text-accent" />
              </motion.div>
              
              {/* Pulse effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2
                }}
                className="absolute inset-0 rounded-full bg-danger/20"
              />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Oups ! Une erreur est survenue
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Nous sommes désolés, quelque chose s&apos;est mal passé.
            </p>
            
            {/* Message d'erreur technique (seulement en dev) */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.6 }}
                className="mt-6 p-4 bg-muted rounded-lg text-left"
              >
                <p className="text-sm font-mono text-danger break-words">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer btn btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Réessayer
            </motion.button>
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer btn btn-outline inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </motion.button>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost inline-flex items-center gap-2"
            >
              <Home className="h-5 w-5" />
              Accueil
            </motion.a>
          </motion.div>

          {/* Informations d'aide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Si le problème persiste, n&apos;hésitez pas à nous contacter
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href="mailto:support@emerald-store.com" 
                className="text-sm text-primary hover:underline"
              >
                Support technique
              </a>
              <span className="text-muted-foreground">•</span>
              <a 
                href="/faq" 
                className="text-sm text-primary hover:underline"
              >
                FAQ
              </a>
              <span className="text-muted-foreground">•</span>
              <a 
                href="/contact" 
                className="text-sm text-primary hover:underline"
              >
                Contact
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}