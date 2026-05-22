import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type {
  Mascota,
  CreateMascotaRequest,
  UpdateMascotaRequest,
  MascotasListResponse,
  MascotaResponse,
  MascotaImagenResponse,
  PaginationMeta
} from "../types";

export interface GetMascotasParams {
  page?: number;
  per_page?: number;
}

export interface MascotasResult {
  data: Mascota[];
  pagination: PaginationMeta;
}

export async function getMascotas(params?: GetMascotasParams): Promise<MascotasResult> {
  const response = await apiClient.get<MascotasListResponse>(ENDPOINTS.pets.list, {
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

export async function getMascotasByOwner(ownerId: string): Promise<Mascota[]> {
  const response = await apiClient.get<MascotasListResponse>(ENDPOINTS.pets.byOwner(ownerId));
  return response.data.data;
}

export async function searchMascotas(query: string): Promise<Mascota[]> {
  const response = await apiClient.get<MascotasListResponse>(ENDPOINTS.pets.search, {
    params: { q: query },
  });
  return response.data.data;
}
