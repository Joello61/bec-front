export const endpoints = {
  // Auth
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    me: '/me',
    verifyEmail: '/verify-email',
    verifyPhone: '/verify-phone',
    resendVerification: '/resend-verification',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    changePassword: '/change-password',
    googleAuth: '/auth/google',
    googleCallback: '/auth/google/callback',
    facebookAuth: '/auth/facebook',
    facebookCallback: '/auth/facebook/callback',
  },

  // Users
  users: {
    list: '/users',
    show: (id: number) => `/users/${id}`,
    updateMe: '/users/me',
    search: '/users/search',
    dashboard: '/users/me/dashboard',
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
    matchingDemandes: (id: number) => `/voyages/${id}/matching-demandes`,
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
    matchingVoyages: (id: number) => `/demandes/${id}/matching-voyages`,
  },

  // Messages (simplifié)
  messages: {
    send: '/messages',
    unreadCount: '/messages/unread-count',
    delete: (id: number) => `/messages/${id}`,
  },

  // Conversations (nouveau)
  conversations: {
    list: '/conversations',
    show: (id: number) => `/conversations/${id}`,
    withUser: (userId: number) => `/conversations/with/${userId}`,
    markRead: (id: number) => `/conversations/${id}/mark-read`,
    unreadCount: '/conversations/unread-count',
    delete: (id: number) => `/conversations/${id}`,
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
    remove: (id: number, type: 'voyage' | 'demande') => `/favoris/${type}/${id}`,
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
    me: '/signalements/me',
    create: '/signalements',
    process: (id: number) => `/signalements/${id}/traiter`,
    pendingCount: '/signalements/pending-count',
  },

  // Settings
  settings: {
    get: '/settings',
    update: '/settings',
    reset: '/settings/reset',
    export: '/settings/export',
  },

  // Propositions
  propositions: {
    create: (voyageId: number) => `/propositions/voyage/${voyageId}`,
    respond: (id: number) => `/propositions/${id}/respond`,
    byVoyage: (voyageId: number) => `/propositions/voyage/${voyageId}`,
    acceptedByVoyage: (voyageId: number) => `/propositions/voyage/${voyageId}/accepted`,
    mySent: '/propositions/me/sent',
    myReceived: '/propositions/me/received',
    myPendingCount: '/propositions/me/pending-count',
  },
} as const;