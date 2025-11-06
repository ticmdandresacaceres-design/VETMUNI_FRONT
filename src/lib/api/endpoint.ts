export const ENDPOINTS = {
  // =====================
  // Auth (general)
  // =====================
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me', 
  },

  // =====================
  // Admin (gestiona todo)
  // =====================
  admin: {
    // Dueños
    duenios: {
      list: '/admin/dueno',
      create: '/admin/dueno',
      getById: (id: string) => `/admin/dueno/${id}`,
      update: (id: string) => `/admin/dueno/${id}`,
      delete: (id: string) => `/admin/dueno/${id}`,
      search: '/admin/dueno/search',
      mascotas: (duenoId: string) => `/admin/dueno/${duenoId}/mascotas`, 
    },

    // Mascotas
    mascotas: {
      list: '/admin/mascota',
      create: '/admin/mascota',
      getById: (id: number) => `/admin/mascota/${id}`,
      update: (id: number) => `/admin/mascota/${id}`,
      delete: (id: number) => `/admin/mascota/${id}`,
      search: '/admin/mascota/search',
      vacunas: (id: number) => `/admin/mascota/${id}/vacunas`,
      historial: (id: number) => `/admin/mascota/${id}/historial`,
    },
  },

  // =====================
  // Dueño (gestiona su cuenta y sus mascotas)
  // =====================
  dueno: {
    profile: {
      get: '/dueno/profile',
      update: '/dueno/profile',
    },

    mascotas: {
      list: '/dueno/mascota',
      create: '/dueno/mascota',
      getById: (id: number) => `/dueno/mascota/${id}`,
      update: (id: number) => `/dueno/mascota/${id}`,
      delete: (id: number) => `/dueno/mascota/${id}`,
      vacunas: (id: number) => `/dueno/mascota/${id}/vacunas`,
      historial: (id: number) => `/dueno/mascota/${id}/historial`,
    },
  },
} as const
