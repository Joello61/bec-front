'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { AvisStats as AvisStatsType } from '@/types';

interface AvisStatsProps {
  stats: AvisStatsType;
}

export default function AvisStats({ stats }: AvisStatsProps) {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Average */}
      <div className="text-center pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-4xl font-bold text-gray-900">
            {stats.average.toFixed(1)}
          </span>
          <Star className="w-8 h-8 fill-warning text-warning" />
        </div>
        <p className="text-sm text-gray-600">
          Basé sur {stats.total} avis
        </p>
      </div>

      {/* Distribution */}
      <div className="space-y-2">
        {ratings.map((rating) => {
          const count = stats.distribution[rating as keyof typeof stats.distribution] || 0;
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <Star className="w-3.5 h-3.5 fill-warning text-warning" />
              </div>

              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                  className="h-full bg-warning"
                />
              </div>

              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}