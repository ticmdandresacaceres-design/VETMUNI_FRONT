/**
 * Centralized API Endpoints Configuration
 * Base URL se configura en el client.ts
 */

export const ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Dueños (Owners) endpoints
  duenos: {
    list: '/duenos',
    create: '/duenos',
    getById: (id: number) => `/duenos/${id}`,
    update: (id: number) => `/duenos/${id}`,
    delete: (id: number) => `/duenos/${id}`,
    search: '/duenos/search',
    // Mascotas de un dueño específico
    mascotas: (duenoId: number) => `/duenos/${duenoId}/mascotas`,
  },

  // Mascotas (Pets) endpoints
  mascotas: {
    list: '/mascotas',
    create: '/mascotas',
    getById: (id: number) => `/mascotas/${id}`,
    update: (id: number) => `/mascotas/${id}`,
    delete: (id: number) => `/mascotas/${id}`,
    search: '/mascotas/search',
    // Vacunas de una mascota específica
    vacunas: (mascotaId: number) => `/mascotas/${mascotaId}/vacunas`,
    // Historial médico
    historial: (mascotaId: number) => `/mascotas/${mascotaId}/historial`,
  },

  // Vacunas (Vaccines) endpoints
  vacunas: {
    list: '/vacunas',
    create: '/vacunas',
    getById: (id: number) => `/vacunas/${id}`,
    update: (id: number) => `/vacunas/${id}`,
    delete: (id: number) => `/vacunas/${id}`,
    // Próximas vacunas
    proximas: '/vacunas/proximas',
    // Vacunas vencidas
    vencidas: '/vacunas/vencidas',
  },

  // Documentos endpoints
  documentos: {
    list: '/documentos',
    upload: '/documentos/upload',
    getById: (id: number) => `/documentos/${id}`,
    download: (id: number) => `/documentos/${id}/download`,
    delete: (id: number) => `/documentos/${id}`,
    // Por mascota
    byMascota: (mascotaId: number) => `/mascotas/${mascotaId}/documentos`,
  },

  // Reportes endpoints
  reportes: {
    general: '/reportes/general',
    mascotas: '/reportes/mascotas',
    vacunas: '/reportes/vacunas',
    duenos: '/reportes/duenos',
    // Exportar reportes
    export: (tipo: 'pdf' | 'excel') => `/reportes/export/${tipo}`,
  },

  // Usuarios (si tienes gestión de usuarios)
  usuarios: {
    list: '/usuarios',
    create: '/usuarios',
    getById: (id: number) => `/usuarios/${id}`,
    update: (id: number) => `/usuarios/${id}`,
    delete: (id: number) => `/usuarios/${id}`,
    changePassword: (id: number) => `/usuarios/${id}/password`,
  },
} as const

/**
 * Helper function para construir query params
 * Ejemplo: buildQueryString({ page: 1, limit: 10 }) => "?page=1&limit=10"
 */
export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Type helpers para autocompletado
 */
export type EndpointKeys = keyof typeof ENDPOINTS
export type AuthEndpoints = typeof ENDPOINTS.auth
export type DuenosEndpoints = typeof ENDPOINTS.duenos
export type MascotasEndpoints = typeof ENDPOINTS.mascotas
export type VacunasEndpoints = typeof ENDPOINTS.vacunas