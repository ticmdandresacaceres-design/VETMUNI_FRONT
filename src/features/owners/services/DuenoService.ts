import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type { 
  Dueno, 
  CreateDuenoRequest, 
  UpdateDuenoRequest,
  DuenosListResponse,
  DuenoResponse,
  PaginationMeta
} from "../types";

export interface GetDuenosParams {
  page?: number;
  per_page?: number;
}

export interface DuenosResult {
  data: Dueno[];
  pagination: PaginationMeta;
}

export async function getDuenos(params?: GetDuenosParams): Promise<DuenosResult> {
  const response = await apiClient.get<DuenosListResponse>(ENDPOINTS.users.owners.list, {
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

export async function createDueno(data: CreateDuenoRequest): Promise<Dueno> {
  const response = await apiClient.post<DuenoResponse>(ENDPOINTS.users.owners.create, data);
  return response.data.data;
}

export async function updateDueno(id: string, data: UpdateDuenoRequest): Promise<Dueno> {
  const response = await apiClient.put<DuenoResponse>(ENDPOINTS.users.owners.update(id), data);
  return response.data.data;
}

export async function deleteDueno(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.users.owners.delete(id));
}

export async function getDuenoById(id: string): Promise<Dueno> {
  const response = await apiClient.get<DuenoResponse>(`/users/${id}`);
  return response.data.data;
}
