'use client';

import { motion } from 'framer-motion';
import { Plane, Package, Bell, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import type { DashboardSummary } from '@/types';

interface DashboardSummaryProps {
  data: DashboardSummary;
}

export default function DashboardSummary({ data }: DashboardSummaryProps) {
  const cards = [
    {
      title: 'Voyages actifs',
      value: data.voyagesActifs,
      icon: Plane,
    },
    {
      title: 'Demandes en cours',
      value: data.demandesEnCours,
      icon: Package,
    },
    {
      title: 'Notifications',
      value: data.notificationsNonLues,
      icon: Bell,
    },
    {
      title: 'Messages',
      value: data.messagesNonLus,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <card.icon className='w-6 h-6 text-primary' />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}