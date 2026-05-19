import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type { 
  Mascota, 
  CreateMascotaRequest, 
  UpdateMascotaRequest,
  MascotasListResponse,
  MascotaResponse,
  MascotaImagenResponse
} from "../types";

export async function getMascotas(): Promise<Mascota[]> {
  const response = await apiClient.get<MascotasListResponse>(ENDPOINTS.pets.list);
  return response.data.data;
}

export async function createMascota(data: CreateMascotaRequest): Promise<Mascota> {
  const response = await apiClient.post<MascotaResponse>(ENDPOINTS.pets.create, data);
  return response.data.data;
}

export async function updateMascota(id: string, data: UpdateMascotaRequest): Promise<Mascota> {
  const response = await apiClient.put<MascotaResponse>(ENDPOINTS.pets.update(id), data);
  return response.data.data;
}

export async function deleteMascota(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.pets.delete(id));
}

export async function getMascotaById(id: string): Promise<Mascota> {
  const response = await apiClient.get<MascotaResponse>(ENDPOINTS.pets.getById(id));
  return response.data.data;
}

export async function uploadPetImage(petId: string, image: File): Promise<MascotaImagenResponse> {
  const formData = new FormData();
  formData.append("pet_id", petId);
  formData.append("image", image);

  const response = await apiClient.post<MascotaImagenResponse>(ENDPOINTS.images.upload, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deletePetImage(imageId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.images.delete(imageId));
}
