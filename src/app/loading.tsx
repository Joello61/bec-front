'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo animé */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            rotate: {
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }
          }}
          className="relative"
        >
          <div className="w-25 h-25 rounded-xl flex items-center justify-center shadow-lg border-2 border-primary bg-white">
            <Image
              src="/images/logo/logo_icon_only.png"
              alt="Logo de Co-Baggage"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Cercle de chargement */}
          <motion.div
            animate={{ 
              rotate: [0, -360],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
            className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
          />
        </motion.div>

        {/* Texte de chargement */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold mb-2"
          >
            Chargement
          </motion.h2>
          
          {/* Points animés */}
          <motion.div className="flex gap-1 justify-center">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        </div>

        {/* Barre de progression indéterminée */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>
      </motion.div>
    </div>
  )
}