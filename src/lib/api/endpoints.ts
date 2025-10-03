export const endpoints = {
  // Auth
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    me: '/me',
  },

  // Users
  users: {
    list: '/users',
    show: (id: number) => `/users/${id}`,
    updateMe: '/users/me',
    search: '/users/search',
  },

  // Voyages
  voyages: {
    list: '/voyages',
    show: (id: number) => `/voyages/${id}`,
    create: '/voyages',
    update: (id: number) => `/voyages/${id}`,
    updateStatus: (id: number) => `/voyages/${id}/statut`,
    delete: (id: number) => `/voyages/${id}`,
    byUser: (userId: number) => `/voyages/user/${userId}`,
  },

  // Demandes
  demandes: {
    list: '/demandes',
    show: (id: number) => `/demandes/${id}`,
    create: '/demandes',
    update: (id: number) => `/demandes/${id}`,
    updateStatus: (id: number) => `/demandes/${id}/statut`,
    delete: (id: number) => `/demandes/${id}`,
    byUser: (userId: number) => `/demandes/user/${userId}`,
  },

  // Messages
  messages: {
    send: '/messages',
    conversations: '/messages/conversations',
    conversation: (userId: number) => `/messages/conversation/${userId}`,
    markRead: (userId: number) => `/messages/conversation/${userId}/mark-read`,
    unreadCount: '/messages/unread-count',
    delete: (id: number) => `/messages/${id}`,
  },

  // Notifications
  notifications: {
    list: '/notifications',
    unread: '/notifications/unread',
    unreadCount: '/notifications/unread-count',
    markRead: (id: number) => `/notifications/${id}/mark-read`,
    markAllRead: '/notifications/mark-all-read',
    delete: (id: number) => `/notifications/${id}`,
  },

  // Favoris
  favoris: {
    list: '/favoris',
    voyages: '/favoris/voyages',
    demandes: '/favoris/demandes',
    addVoyage: (voyageId: number) => `/favoris/voyage/${voyageId}`,
    addDemande: (demandeId: number) => `/favoris/demande/${demandeId}`,
    remove: (id: number) => `/favoris/${id}`,
  },

  // Avis
  avis: {
    byUser: (userId: number) => `/avis/user/${userId}`,
    create: '/avis',
    update: (id: number) => `/avis/${id}`,
    delete: (id: number) => `/avis/${id}`,
  },

  // Signalements
  signalements: {
    list: '/signalements',
    create: '/signalements',
    process: (id: number) => `/signalements/${id}/traiter`,
    pendingCount: '/signalements/pending-count',
  },
} as const;