export const ENDPOINTS = {

  // Rutas de autenticación
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/user',
  },

  // Rutas de usuarios
  users: {
    veterinarians: {
      list: "users/veterinarians",
      create: "users/veterinarians",
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    owners: {
      list: "users/owners",
      create: "users/owners",
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    }
  },


  // Rutas de mascotas
  pets: {
    list: "/pets",
    create: "/pets",
    getById: (id: string) => `/pets/${id}`,
    update: (id: string) => `/pets/${id}`,
    delete: (id: string) => `/pets/${id}`,
    byOwner: (ownerId: string) => `/pets/owner/${ownerId}`,
    search: "/pets/search"
  },

  // Rutas de imágenes de mascotas
  images: {
    upload: "/pets/images",
    delete: (id: string) => `/pets/images/${id}`,
  },

  // Rutas de vacunas
  vaccines: {
    list: "/vaccines",
    create: "/vaccines",
    getById: (id: string) => `/vaccines/${id}`,
    update: (id: string) => `/vaccines/${id}`,
    delete: (id: string) => `/vaccines/${id}`,
  },

  // Rutas de estadisticas 
  stats: {
    dashboard: "/stats/dashboard",
    vaccinesAlerts: "/stats/vaccine-alerts",
    unvaccinated: "/stats/unvaccinated",
    monthlyActivity: "/stats/monthly-activity",
    speciesDistribution: "/stats/species-distribution",
  }

} as const
