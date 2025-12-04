import { update } from "@/src/features/vet-dashboard/mascotas/services/MascotaService";
import { get } from "http";

export const ENDPOINTS = {

  // =====================
  // auth 
  // =====================
  auth: {
        login: '/auth/login',
    },

  // =====================
  // admin gestiona veterinarias
  // =====================
  admin: {
    veterinaria: {
      list: '/admin/vet',
      create: '/admin/vet/register',
      getById: (id: string) => `/admin/vet/${id}`,
      block: (id: string) => `/admin/vet/${id}/toggle-block`,
    }
  },
 
  // =====================
  // veterinaria gestiona mascotas y dueños
  // =====================
  veterinaria: {
    // Dueños
    duenios: {
      list: '/veterinaria/dueno',
      create: '/veterinaria/dueno',
      getById: (id: string) => `/veterinaria/dueno/${id}`,
      update: (id: string) => `/veterinaria/dueno/${id}`,
      delete: (id: string) => `/veterinaria/dueno/${id}`,
      search: '/veterinaria/dueno/search',
      details: (id: string) => `/veterinaria/dueno/details/${id}`,
    },

    // Mascotas
    mascotas: {
      list: '/veterinaria/mascota',
      create: '/veterinaria/mascota',
      getById: (id: string) => `/veterinaria/mascota/${id}`,
      update: (id: string) => `/veterinaria/mascota/${id}`,
      delete: (id: string) => `/veterinaria/mascota/${id}`,
      search: '/veterinaria/mascota/search',
      filter: '/veterinaria/mascota/filter',
      details: (id: string) => `/veterinaria/mascota/details/${id}`,
    },
    vacunas: {
      list: '/veterinaria/vacuna',
      create: '/veterinaria/vacuna',
      getById: (id: string) => `/veterinaria/vacuna/${id}`,
      delete: (id: string) => `/veterinaria/vacuna/${id}`,
      filter: '/veterinaria/vacuna/filter',
      update: (id: string) => `/veterinaria/vacuna/${id}`,
      findByDateRange: '/veterinaria/vacuna/date-range',
    },
    reportes: {
      exportByDuenoId: (duenoId: string) => `/veterinaria/reporte/dueno/${duenoId}`,
      exportAllData: '/veterinaria/reporte/todos',
    },
    stats: {
      overview: '/veterinaria/stats/overview',
    },
    imagen:{
      upload: '/veterinaria/mascota/imagen/upload',
    }
  },
} as const
