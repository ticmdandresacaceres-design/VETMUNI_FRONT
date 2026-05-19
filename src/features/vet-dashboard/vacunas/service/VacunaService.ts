import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type { 
  Vacuna, 
  CreateVacunaRequest, 
  UpdateVacunaRequest,
  VacunasListResponse,
  VacunaResponse
} from "../types";

export async function getVacunas(): Promise<Vacuna[]> {
  const response = await apiClient.get<VacunasListResponse>(ENDPOINTS.vaccines.list);
  return response.data.data;
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
