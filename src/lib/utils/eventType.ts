export const EventType = {
  // UTILISATEUR
  USER_REGISTERED: 'user.registered',
  USER_VERIFIED_PHONE: 'user.verified_phone',
  USER_PROFILE_UPDATED: 'user.updated',
  USER_SETTINGS_UPDATED: 'user.settings.updated',
  USER_BANNED: 'user.banned',
  USER_DELETED: 'user.deleted',
  USER_UNBANNED: 'user.unbanned',
  USER_PASSWORD_RESET: 'user.password.reset',
  USER_PASSWORD_FORGOT: 'user.password.forgot',
  USER_ADDRESS_DELETED: 'user.address.deleted',
  SETTINGS_UPDATED: 'settings.updated',
  SETTINGS_NOTIFICATIONS_CHANGED: 'settings.notifications.changed',

  // DEMANDES
  DEMANDE_CREATED: 'demande.created',
  DEMANDE_UPDATED: 'demande.updated',
  DEMANDE_CANCELLED: 'demande.cancelled',
  DEMANDE_EXPIRED: 'demande.expired',
  DEMANDE_STATUT_UPDATED: 'demande.statut.updated',
  DEMANDE_MATCHED: 'demande.matched',
  DEMANDE_FAVORITED: 'demande.favorited',
  DEMANDE_UNFAVORITED: 'demande.unfavorited',

  // VOYAGES
  VOYAGE_CREATED: 'voyage.created',
  VOYAGE_UPDATED: 'voyage.updated',
  VOYAGE_CANCELLED: 'voyage.cancelled',
  VOYAGE_COMPLETED: 'voyage.completed',
  VOYAGE_EXPIRED: 'voyage.expired',
  VOYAGE_FAVORITED: 'voyage.favorited',
  VOYAGE_UNFAVORITED: 'voyage.unfavorited',

  // PROPOSITIONS
  PROPOSITION_CREATED: 'proposition.created',
  PROPOSITION_ACCEPTED: 'proposition.accepted',
  PROPOSITION_REJECTED: 'proposition.rejected',
  PROPOSITION_CANCELLED: 'proposition.cancelled',

  // MESSAGERIE
  CONVERSATION_DELETED: 'conversation.deleted',
  CONVERSATION_CREATED: 'conversation.created',
  MESSAGE_SENT: 'message.sent',
  MESSAGE_READ: 'message.read',
  MESSAGE_DELETED: 'message.deleted',

  // NOTIFICATIONS
  NOTIFICATION_NEW: 'notification.new',
  NOTIFICATION_READ: 'notification.read',
  NOTIFICATION_DELETED: 'notification.deleted',

  // AVIS
  AVIS_CREATED: 'avis.created',
  AVIS_UPDATED: 'avis.updated',
  AVIS_DELETED: 'avis.deleted',

  // SIGNALEMENTS
  SIGNALEMENT_CREATED: 'signalement.created',
  SIGNALEMENT_RESOLVED: 'signalement.resolved',
  SIGNALEMENT_REJECTED: 'signalement.rejected',
  SIGNALEMENT_HANDLED: 'signalement.handled',

  // ADMIN
  ADMIN_STATS_UPDATED: 'admin.stats.updated',
  CONTACT_FORM_SUBMITTED: 'contact.submitted',
  ADMIN_USER_BANNED: 'admin.user.banned',
  ADMIN_USER_UNBANNED: 'admin.user.unbanned',
  ADMIN_USER_DELETED: 'admin.user.deleted',
  ADMIN_NOTIFICATION_SENT: 'admin.notification.sent',
  ADMIN_WARNING_SENT: 'admin.warning.sent',

  CONTACT_MESSAGE_DELETED: 'admin.contact.message.deleted',
  
} as const;

// Type dérivé pour le typage fort
export type EventTypeKey = keyof typeof EventType;
export type EventTypeValue = typeof EventType[EventTypeKey];