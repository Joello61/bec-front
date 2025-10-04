'use client';

import { motion } from 'framer-motion';
import { Plane, Package, MessageCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';

export default function QuickActions() {
  const actions = [
    {
      icon: Plane,
      label: 'Créer un voyage',
      href: ROUTES.MES_VOYAGES,
    },
    {
      icon: Package,
      label: 'Faire une demande',
      href: ROUTES.MES_DEMANDES,
    },
    {
      icon: MessageCircle,
      label: 'Voir mes messages',
      href: ROUTES.MESSAGES,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
            <p className="text-sm text-gray-500">Accédez rapidement aux fonctionnalités</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <div
                  className='p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer group'
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className='w-5 h-5 text-primary' />
                    </div>
                    <span className='font-medium text-primary'>{action.label}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}