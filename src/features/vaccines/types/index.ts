
export interface PetBrief {
  id: string;
  name: string;
  species?: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

export interface Vacuna {
  id: string;
  type: string;
  aplication_date: string;
  months_validity: number;
  expiration_date: string;
  pet_id: string;
  pet?: PetBrief;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVacunaRequest {
  type: string;
  aplication_date: string;
  months_validity: number;
  pet_id: string;
}

export interface UpdateVacunaRequest {
  type?: string;
  aplication_date?: string;
  months_validity?: number;
  pet_id?: string;
}

export interface VacunaResponse {
  data: Vacuna;
}

export interface VacunasListResponse {
  data: Vacuna[];
  pagination: PaginationMeta;
}
