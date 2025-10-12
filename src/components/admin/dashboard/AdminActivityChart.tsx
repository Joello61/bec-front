'use client';

import { motion } from 'framer-motion';
import type { AdminActivityStats } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AdminActivityChartProps {
  activity: AdminActivityStats;
}

export default function AdminActivityChart({ activity }: AdminActivityChartProps) {
  const maxValue = Math.max(
    ...activity.derniers7Jours.map((day) => 
      day.inscriptions + day.voyages + day.demandes + day.signalements
    )
  );

  const getTrendIcon = () => {
    switch (activity.tendance.direction) {
      case 'hausse':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'baisse':
        return <TrendingDown className="w-5 h-5 text-error" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (activity.tendance.direction) {
      case 'hausse':
        return 'text-success';
      case 'baisse':
        return 'text-error';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Activité des 7 derniers jours
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Évolution de l&apos;activité sur la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`font-semibold ${getTrendColor()}`}>
            {activity.tendance.percentage > 0 ? '+' : ''}
            {activity.tendance.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {activity.derniers7Jours.map((day, index) => {
          const total = day.inscriptions + day.voyages + day.demandes + day.signalements;
          const percentage = maxValue > 0 ? (total / maxValue) * 100 : 0;

          return (
            <div key={day.date} className="space-y-2">
              {/* Day Label */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{day.dayName}</span>
                <span className="text-gray-500">{total} actions</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-primary-dark"
                />
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>
                  <span className="font-semibold">{day.inscriptions}</span> inscriptions
                </span>
                <span>
                  <span className="font-semibold">{day.voyages}</span> voyages
                </span>
                <span>
                  <span className="font-semibold">{day.demandes}</span> demandes
                </span>
                {day.signalements > 0 && (
                  <span className="text-warning">
                    <span className="font-semibold">{day.signalements}</span> signalements
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-gray-600">Total activité</span>
          </div>
        </div>
      </div>
    </div>
  );
}