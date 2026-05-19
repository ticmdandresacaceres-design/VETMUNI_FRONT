// Tipos para el usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: string[];
}

// Tipos para las requests
export interface LoginRequest {
  email: string;
  password: string;
}

// Tipos para las responses de autenticación
export interface AuthResponse {
  "message": string;
  "token": string;
  "token_type": string;
  "expires_in": number;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

