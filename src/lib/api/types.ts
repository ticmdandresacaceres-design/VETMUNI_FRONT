export type ApiErrorResponse = {
    timestamp?: string; 
    status?: number;
    error?: string;
    message?: string;
    path?: string;
    details?: Record<string, unknown>;
};

// Tipo base para respuestas del backend
export interface OperationResponseStatus {
    success: boolean;
    message: string;
}

// Tipos para operaciones con data (para casos donde sí retornas data)
export interface CreateResponse<T> extends OperationResponseStatus {
    data?: T;
}

export interface UpdateResponse<T> extends OperationResponseStatus {
    data?: T;
}

export interface DeleteResponse extends OperationResponseStatus {}