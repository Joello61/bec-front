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
    profileStatus: '/users/me/profile-status',
    completeProfile: '/users/me/complete-profile',
    addressModificationInfo: '/users/me/address/modification-info',
    updateAddress: '/users/me/address',
    manageAvatar: '/users/me/avatar',
  },

  // ==================== CURRENCIES (NOUVEAU) ====================
  currencies: {
    list: '/currencies',
    popular: '/currencies/popular',
    show: (code: string) => `/currencies/${code}`,
    convert: '/currencies/convert',
    detectByCountry: '/currencies/detect-by-country',
    format: '/currencies/format',
    updateRates: '/currencies/update-rates',
    default: '/currencies/default',
    convertBatch: '/currencies/convert-batch',
  },

  // Voyages
  voyages: {
    list: '/voyages',
    publicList: '/voyages/public',
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
    publicList: '/demandes/public',
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
    byId: (id: number) => `/propositions/${id}`,
    create: (voyageId: number) => `/propositions/voyage/${voyageId}`,
    respond: (id: number) => `/propositions/${id}/respond`,
    delete: (id: number) => `/propositions/${id}`,
    byVoyage: (voyageId: number) => `/propositions/voyage/${voyageId}`,
    acceptedByVoyage: (voyageId: number) => `/propositions/voyage/${voyageId}/accepted`,
    mySent: '/propositions/me/sent',
    myReceived: '/propositions/me/received',
    myPendingCount: '/propositions/me/pending-count',
  },

  // Admin
  admin: {
    // Dashboard
    dashboard: '/admin/dashboard',
    stats: (type: string) => `/admin/stats/${type}`,
    
    // Users
    users: '/admin/users',
    userDetails: (id: number) => `/admin/users/${id}`,
    userActivity: (id: number) => `/admin/users/${id}/activity`,
    userAdminLogs: (id: number) => `/admin/users/${id}/admin-logs`,
    searchUsers: '/admin/users/search',
    banUser: (id: number) => `/admin/users/${id}/ban`,
    unbanUser: (id: number) => `/admin/users/${id}/unban`,
    updateRoles: (id: number) => `/admin/users/${id}/roles`,
    deleteUser: (id: number) => `/admin/users/${id}`,
    
    // Modération
    deleteVoyage: (id: number) => `/admin/moderation/voyages/${id}`,
    deleteDemande: (id: number) => `/admin/moderation/demandes/${id}`,
    deleteAvis: (id: number) => `/admin/moderation/avis/${id}`,
    deleteMessage: (id: number) => `/admin/moderation/messages/${id}`,
    deleteAllUserContent: (userId: number) => `/admin/moderation/users/${userId}/delete-all`,
    moderationStats: '/admin/moderation/stats',
    
    // Logs
    logs: '/admin/logs',
    logsByAdmin: (adminId: number) => `/admin/logs/admin/${adminId}`,
    logsStats: '/admin/logs/stats',
    exportLogs: '/admin/logs/export',
  },

  contacts: {
    create: '/contacts/send',
    list: '/contacts',
    show: (id: number) => `/contacts/${id}`,
    delete: (id: number) => `/contacts/${id}`,
  },

  geo: {
    countries: '/geo/countries',
    cities: '/geo/cities',
    searchCities: '/geo/cities/search',
    topCitiesGlobal: '/geo/cities/top100',
    searchCitiesGlobal: '/geo/cities/search-global',
    continent: (pays: string) => `/geo/continent/${pays}`,
  },
} as const;