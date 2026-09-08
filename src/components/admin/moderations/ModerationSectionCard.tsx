'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Route } from 'next';
import type { ReactNode } from 'react';

interface ModerationSectionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: Route;
  color: string;
  index: number;
}

export default function ModerationSectionCard({
  title,
  description,
  icon,
  href,
  color,
  index,
}: ModerationSectionCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
