
export interface Dueno {
  id: string;
  dni: string;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  latitude: string;
  longitude: string;
  active: boolean;
  roles?: string[];
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

export interface CreateDuenoRequest {
  dni: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
}

export interface UpdateDuenoRequest {
  name?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
}

export interface DuenoResponse {
  data: Dueno;
}

export interface DuenosListResponse {
  data: Dueno[];
  pagination: PaginationMeta;
}
