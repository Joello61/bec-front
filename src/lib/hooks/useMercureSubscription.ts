/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { mercureService } from '@/lib/services/mercureService';
import type { StableContext } from '@/types/realtime';
import { EventType, EventTypeValue } from '@/lib/utils/eventType';
import { dispatchMercureEvent } from '../handlers';

/**
 * Hook global React pour initialiser la connexion Mercure
 * et écouter tous les flux principaux (globaux).
 */
export function useGlobalMercureSubscription(stable: StableContext) {
  useEffect(() => {
  if (!stable?.userId) return;

  const baseUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
  const isAdmin = Boolean(stable.isAdmin);

  const topics = [
    `${baseUrl}/users/${stable.userId}`,
    `${baseUrl}/demandes`,
    `${baseUrl}/voyages`,
    `${baseUrl}/propositions`,
    `${baseUrl}/public`,
  ];

  if (isAdmin) topics.push(`${baseUrl}/groups/admin`);

  topics.forEach((topic) => mercureService.addTopic(topic));
  mercureService.connect();

  console.log('[Mercure] Connecté aux topics globaux:', topics);

  const eventTypes = Object.values(EventType) as EventTypeValue[];
  const unsubscribers = eventTypes.map((eventType) =>
    mercureService.on(eventType, (data: any) =>
      dispatchMercureEvent(eventType, data, stable)
    )
  );

  return () => {
    console.log('[Mercure] Déconnexion et nettoyage des listeners');
    unsubscribers.forEach((unsub) => unsub());
    mercureService.disconnect();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [stable.userId, stable.isAdmin]);

}
