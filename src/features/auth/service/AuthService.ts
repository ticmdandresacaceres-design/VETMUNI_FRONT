import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { AuthResponse, LoginRequest } from "../types";
import apiClient, { ApiError } from "@/src/lib/api/axios";
import { tokenStorage } from "@/src/lib/api/token-storage";
import { toast } from "sonner";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
    try {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.auth.login, payload);
        
        if (!response.data || !response.data.token || !response.data.user) {
            toast.error("Error en la respuesta del servidor");
            throw new ApiError("Respuesta inválida del servidor", 500);
        }
        
        const { token, user } = response.data;
        tokenStorage.setTokens(token);
        tokenStorage.setUser(user);
        
        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            // El interceptor YA mostró el toast
            // Solo re-lanzamos el error sin mostrar toast adicional
            throw error;
        }
        
        console.error("Error inesperado en login:", error);
        toast.error("Error inesperado al iniciar sesión");
        throw new ApiError("Error inesperado al iniciar sesión");
    }
}

export async function logout(): Promise<void> {
    try {
        tokenStorage.clearAll();
    } catch (error) {
        console.error("Error al hacer logout:", error);
        throw error;
    } 
}

export function isAuthenticated(): boolean {
    try {
        const token = tokenStorage.getToken();
        const user = tokenStorage.getUser();
        return !!(token && user);
    } catch (error) {
        console.error("Error verificando autenticación:", error);
        return false;
    }
}

export function getCurrentUser() {
    try {
        return tokenStorage.getUser();
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        return null;
    }
}