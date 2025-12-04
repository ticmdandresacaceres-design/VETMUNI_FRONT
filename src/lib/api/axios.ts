import axios from "axios";
import { toast } from "sonner";
import type { ApiErrorResponse } from "./types";
import { tokenStorage } from "./token-storage";

// Clase personalizada para errores de API
export class ApiError extends Error {
    public status?: number;
    public data?: ApiErrorResponse;
    
    constructor(message: string, status?: number, data?: ApiErrorResponse) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const apiClient = axios.create({baseURL: "http://localhost:8080/api/v1"});

// Interceptor de solicitud para agregar tokens de autenticación 
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar errores
apiClient.interceptors.response.use(
    (response) => {
        // Respuesta exitosa 
        return response;
    },
    async (error) => {
        // Si el error tiene respuesta del servidor
        if (error.response) {
            const { status, data } = error.response;
            
            // Crear el objeto ApiErrorResponse
            const apiErrorData: ApiErrorResponse = {
                timestamp: data?.timestamp || new Date().toISOString(),
                status: status,
                error: data?.error || error.response.statusText,
                message: data?.message || `Error ${status}`,
                path: data?.path || error.config?.url || 'unknown',
                details: data?.details || null
            };
            
            // Manejar errores 401
            if (status === 401) {
                const isLoginEndpoint = error.config?.url?.includes('/auth/login') || false;
                const message = data?.message?.toLowerCase() || '';
                const errorType = data?.error || '';
                
                // Verificar si es cuenta bloqueada
                const isBlocked = message.includes('bloqueada') || 
                                message.includes('blocked') ||
                                (errorType === 'InvalidCredentials' && message.includes('bloqueada'));
                
                if (isBlocked) {
                    // Cuenta bloqueada - Mostrar toast aquí
                    toast.error(data?.message || "Tu cuenta ha sido bloqueada. Contacta al administrador.", {
                        duration: 5000,
                        position: "bottom-right",
                    });
                    
                    // Lanzar el error para que el servicio lo maneje
                    throw new ApiError(apiErrorData.message || "Error de autenticación", status, apiErrorData);
                }
                
                // Token expirado o credenciales inválidas (pero NO bloqueada y NO es login)
                if (!isLoginEndpoint) {
                    tokenStorage.clearAll();
                    
                    toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", {
                        duration: 4000,
                        position: "bottom-right"
                    });
                    
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                }
                
                // Lanzar el error
                throw new ApiError(apiErrorData.message || "Error de autenticación", status, apiErrorData);
            }
            
            // Manejar errores 403
            if (status === 403) {
                const message = data?.message?.toLowerCase() || '';
                
                const isBlocked = message.includes('bloqueada') || 
                                message.includes('blocked') || 
                                message.includes('deshabilitada') ||
                                message.includes('disabled');
                
                if (isBlocked) {
                    tokenStorage.clearAll();
                    
                    toast.error("Tu cuenta ha sido bloqueada. Contacta al administrador.", {
                        duration: 5000,
                        position: "bottom-right",
                    });
                    
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    toast.error("No tienes permisos para realizar esta acción.", {
                        duration: 4000,
                        position: "bottom-right"
                    });
                }
                
                throw new ApiError(apiErrorData.message || "Error de acceso denegado", status, apiErrorData);
            }
            
            // Otros errores del servidor
            throw new ApiError(
                apiErrorData.message || "Error en la API",
                status,
                apiErrorData
            );
        } 
        
        // Error de conexión
        if (error.request) {
            toast.error("No se pudo conectar al servidor. Verifica tu conexión.", {
                duration: 4000,
                position: "bottom-right"
            });
            
            throw new ApiError(
                "Error de conexión - no se pudo conectar al servidor",
                0,
                {
                    timestamp: new Date().toISOString(),
                    status: 0,
                    error: "Network Error",
                    message: "No se pudo conectar al servidor",
                    path: error.config?.url || 'unknown'
                }
            );
        } 
        
        // Error al configurar la petición
        throw new ApiError(
            error.message || "Error desconocido",
            undefined,
            {
                timestamp: new Date().toISOString(),
                error: "Request Error",
                message: error.message || "Error al configurar la petición"
            }
        );
    }
);

export default apiClient;