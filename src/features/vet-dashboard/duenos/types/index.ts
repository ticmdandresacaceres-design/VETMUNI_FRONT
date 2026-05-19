
export interface Dueno {
  id: string;
  dni: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDuenoRequest {
  dni: string;
  name: string;
  email: string;
  password?: string; // Según GEMINI.MD el endpoint de crear dueño pide password
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
}
