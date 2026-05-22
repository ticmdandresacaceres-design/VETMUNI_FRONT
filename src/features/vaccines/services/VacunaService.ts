import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type { 
  Vacuna, 
  CreateVacunaRequest, 
  UpdateVacunaRequest,
  VacunasListResponse,
  VacunaResponse,
  PaginationMeta
} from "../types";

export interface GetVacunasParams {
  page?: number;
  per_page?: number;
}

export interface VacunasResult {
  data: Vacuna[];
  pagination: PaginationMeta;
}

export async function getVacunas(params?: GetVacunasParams): Promise<VacunasResult> {
  const response = await apiClient.get<VacunasListResponse>(ENDPOINTS.vaccines.list, {
    params: {
      page: params?.page,
      per_page: params?.per_page,
    },
  });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
}

export async function getVacunasPorMascota(petId: string): Promise<Vacuna[]> {
  const response = await apiClient.get<VacunasListResponse>(`/pets/${petId}/vaccines`);
  return response.data.data;
}

export async function createVacuna(data: CreateVacunaRequest): Promise<Vacuna> {
  const response = await apiClient.post<VacunaResponse>(ENDPOINTS.vaccines.create, data);
  return response.data.data;
}

export async function updateVacuna(id: string, data: UpdateVacunaRequest): Promise<Vacuna> {
  const response = await apiClient.put<VacunaResponse>(ENDPOINTS.vaccines.update(id), data);
  return response.data.data;
}

export async function deleteVacuna(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.vaccines.delete(id));
}

export async function getVacunaById(id: string): Promise<Vacuna> {
  const response = await apiClient.get<VacunaResponse>(ENDPOINTS.vaccines.getById(id));
  return response.data.data;
}
