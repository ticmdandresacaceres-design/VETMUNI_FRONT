import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type { 
  Veterinario, 
  CreateVeterinarioRequest, 
  UpdateVeterinarioRequest,
  VeterinariosListResponse,
  VeterinarioResponse
} from "../types";

export async function getVeterinarians(): Promise<Veterinario[]> {
  const response = await apiClient.get<VeterinariosListResponse>(ENDPOINTS.users.veterinarians.list);
  return response.data.data;
}

export async function createVeterinarian(data: CreateVeterinarioRequest): Promise<Veterinario> {
  const response = await apiClient.post<VeterinarioResponse>(ENDPOINTS.users.veterinarians.create, data);
  return response.data.data;
}

export async function updateVeterinarian(id: string, data: UpdateVeterinarioRequest): Promise<Veterinario> {
  const response = await apiClient.put<VeterinarioResponse>(ENDPOINTS.users.veterinarians.update(id), data);
  return response.data.data;
}

export async function deleteVeterinarian(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.users.veterinarians.delete(id));
}

export async function getVeterinarianById(id: string): Promise<Veterinario> {
  // Nota: El endpoint de ver usuario según GEMINI.MD es /users/{user}
  // En endpoint.ts lo tenemos como /users/veterinarians/${id} para veterinarios? 
  // GEMINI.MD dice: GET /users/{user} (punto 5 de Endpoints de Usuarios)
  const response = await apiClient.get<VeterinarioResponse>(`/users/${id}`);
  return response.data.data;
}
