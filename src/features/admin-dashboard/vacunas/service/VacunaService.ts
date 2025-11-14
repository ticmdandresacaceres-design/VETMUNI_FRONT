import apiClient, { ApiError } from "@/src/lib/api/axios";
import { VacunaCreateResponse, VacunaDetails, VacunaNewRequest } from "../types";
import { ENDPOINTS } from "@/src/lib/api/endpoint";



export async function findAll(): Promise<VacunaDetails[]> {
    try{
        const response = await apiClient.get<VacunaDetails[]>(ENDPOINTS.admin.vacunas.list);
        return response.data;
    }catch(error){
        if(error instanceof ApiError){
            console.log("API Error:", error.message);
            throw error;
        }
        throw new Error("Error inesperado al obtener las vacunas");
    }
}

export async function create(payload: VacunaNewRequest): Promise<VacunaCreateResponse> {
    try{
        const response = await apiClient.post<VacunaCreateResponse>(ENDPOINTS.admin.vacunas.create, payload);
        return response.data;
    }catch(error){
        if(error instanceof ApiError){
            console.log("API Error:", error.message);
            throw error;
        }
        throw new Error("Error inesperado al crear la vacuna");
    }
}

export async function findById(id: string): Promise<VacunaDetails> {
    try{
        const response = await apiClient.get<VacunaDetails>(ENDPOINTS.admin.vacunas.getById(id));
        return response.data;
    }catch(error){
        if(error instanceof ApiError){
            console.log("API Error:", error.message);
            throw error;
        }
        throw new Error("Error inesperado al obtener la vacuna");
    }
}

export async function filterByType(tipo: string): Promise<VacunaDetails[]> {
    try{
        const response = await apiClient.get<VacunaDetails[]>(`${ENDPOINTS.admin.vacunas.filter}?tipo=${tipo}`);
        return response.data;
    }catch(error){
        if(error instanceof ApiError){
            console.log("API Error:", error.message);
            throw error;    
        }
        throw new Error("Error inesperado al filtrar las vacunas por tipo");
    }
}

export async function findByDateRange(startDate: string, endDate: string): Promise<VacunaDetails[]> {
    try{
        const response = await apiClient.get<VacunaDetails[]>(ENDPOINTS.admin.vacunas.findByDateRange, {
            params: { startDate, endDate }
        });
        return response.data;
    }catch(error){
        if(error instanceof ApiError){
            console.log("API Error:", error.message);
            throw error;
        }
        throw new Error("Error inesperado al filtrar las vacunas por rango de fechas");
    }
}