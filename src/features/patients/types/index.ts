export interface UserBrief {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Mascota {
  id: string;
  name: string;
  species: string;
  race: string;
  gender: string;
  temperament: string;
  reproductive_condition: string;
  color: string;
  age: string;
  status: string;
  user_id: string;
  user?: UserBrief;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

export interface MascotaImagen {
  id: string;
  filename: string;
  path: string;
  pet_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMascotaRequest {
  name: string;
  species: string;
  race: string;
  gender: string;
  temperament: string;
  reproductive_condition: string;
  color: string;
  years: number;
  months: number;
  status: string;
  user_id: string;
}

export interface UpdateMascotaRequest {
  name?: string;
  species?: string;
  race?: string;
  gender?: string;
  temperament?: string;
  reproductive_condition?: string;
  color?: string;
  years?: number;
  months?: number;
  status?: string;
}

export interface MascotaResponse {
  data: Mascota;
}

export interface MascotasListResponse {
  data: Mascota[];
  pagination: PaginationMeta;
}

export interface MascotaImagenResponse {
  message: string;
  data: MascotaImagen;
}

export type VaccineStatus = "al_dia" | "proxima" | "vencida" | "sin_vacunas";

export interface VaccineStatusInfo {
  label: string;
  status: VaccineStatus;
  lastVaccineDate?: string;
  nextVaccineDate?: string;
  daysToNext?: number;
}
