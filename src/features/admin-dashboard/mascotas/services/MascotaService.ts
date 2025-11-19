import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { MascotaCreateResponse, MascotaDeleteResponse, MascotaDetails, MascotaNewRequest, MascotaPageDetails, MascotaUpdateRequest, MascotaUpdateResponse } from "../types";
import apiClient, { ApiError } from "@/src/lib/api/axios";


// Mascotas service functions
export async function findAll(): Promise<MascotaDetails[]> {
    try{
        const response = await apiClient.get<MascotaDetails[]>(ENDPOINTS.admin.mascotas.list);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener las mascotas");
    }
}

export async function create(payload: MascotaNewRequest): Promise<MascotaCreateResponse> {
    try{
        const response = await apiClient.post<MascotaCreateResponse>(ENDPOINTS.admin.mascotas.create, payload);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al crear la mascota");
    }
}

export async function findById(id: string): Promise<MascotaDetails> {
    try{
        const response = await apiClient.get<MascotaDetails>(ENDPOINTS.admin.mascotas.getById(id));
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener la mascota");
    }
}

export async function update(payload:MascotaUpdateRequest, id: string): Promise<MascotaUpdateResponse> {
    try{
        const response = await apiClient.patch<MascotaUpdateResponse>(ENDPOINTS.admin.mascotas.update(id), payload);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al actualizar la mascota");
    }
}

export async function remove(id: string): Promise<MascotaDeleteResponse> {
    try{
        const response = await apiClient.delete<MascotaDeleteResponse>(ENDPOINTS.admin.mascotas.delete(id));
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al eliminar la mascota");
    }
}

export async function search(term: string): Promise<MascotaDetails[]> {
    try{
        const response = await apiClient.get<MascotaDetails[]>(`${ENDPOINTS.admin.mascotas.search}?term=${term}`);
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al buscar mascotas");
    }
}

export async function filter(especie?: string, sexo?: string, raza?: string): Promise<MascotaDetails[]> {
    try {
        const params = new URLSearchParams()
        
        if (especie && especie.trim()) params.append('especie', especie)
        if (sexo && sexo.trim()) params.append('sexo', sexo)
        if (raza && raza.trim()) params.append('raza', raza)
        
        const queryString = params.toString()
        const url = `${ENDPOINTS.admin.mascotas.filter}${queryString ? `?${queryString}` : ''}`
        
        const response = await apiClient.get<MascotaDetails[]>(url)
        return response.data
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al filtrar mascotas");
    }
}

export async function getPage(mascotaId: string): Promise<MascotaPageDetails> {
    try{
        const response = await apiClient.get<MascotaPageDetails>(ENDPOINTS.admin.mascotas.page(mascotaId));
        return response.data;
    } catch (error) {
        if(error instanceof ApiError){
            console.error("API Error:", error.message);
            throw error;
        }
        throw new ApiError("Error inesperado al obtener la página de mascotas");
    }
}



