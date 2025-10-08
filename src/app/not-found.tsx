'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Page introuvable
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Home className="h-5 w-5" />
                Retour à l&apos;accueil
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}