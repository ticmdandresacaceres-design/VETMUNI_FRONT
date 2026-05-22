
export interface Veterinario {
  id: string;
  email: string;
  name: string;
  dni: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVeterinarioRequest {
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

export interface UpdateVeterinarioRequest {
  name?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
}

export interface VeterinarioResponse {
  data: Veterinario;
}

export interface VeterinariosListResponse {
  data: Veterinario[];
}
