import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as MascotaService from "../services/MascotaService";
import { CreateMascotaRequest, UpdateMascotaRequest } from "../types";
import { toast } from "sonner";

export const mascotaKeys = {
  all: ["mascotas"] as const,
  lists: (params?: MascotaService.GetMascotasParams) => [...mascotaKeys.all, "list", params] as const,
  details: () => [...mascotaKeys.all, "detail"] as const,
  detail: (id: string) => [...mascotaKeys.details(), id] as const,
  search: (query: string) => [...mascotaKeys.all, "search", query] as const,
};

export const useMascotas = (params?: MascotaService.GetMascotasParams) => {
  return useQuery({
    queryKey: mascotaKeys.lists(params),
    queryFn: () => MascotaService.getMascotas(params),
    placeholderData: keepPreviousData,
  });
};

export const useMascota = (id: string) => {
  return useQuery({
    queryKey: mascotaKeys.detail(id),
    queryFn: () => MascotaService.getMascotaById(id),
    enabled: !!id,
  });
};

export const useCreateMascota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMascotaRequest) => MascotaService.createMascota(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mascotaKeys.lists() });
      toast.success("Mascota registrada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar la mascota");
    },
  });
};

export const useUpdateMascota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMascotaRequest }) =>
      MascotaService.updateMascota(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: mascotaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mascotaKeys.detail(id) });
      toast.success("Mascota actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la mascota");
    },
  });
};

export const useDeleteMascota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MascotaService.deleteMascota(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mascotaKeys.lists() });
      toast.success("Mascota eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la mascota");
    },
  });
};

export const useUploadPetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, image }: { petId: string; image: File }) =>
      MascotaService.uploadPetImage(petId, image),
    onSuccess: (_, { petId }) => {
      queryClient.invalidateQueries({ queryKey: mascotaKeys.detail(petId) });
      toast.success("Imagen subida correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al subir la imagen");
    },
  });
};

export const useDeletePetImage = (petId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => MascotaService.deletePetImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mascotaKeys.detail(petId) });
      toast.success("Imagen eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la imagen");
    },
  });
};

export const useGetMascotasByOwner = (ownerId: string) => {
  return useQuery({
    queryKey: ["mascotas", "owner", ownerId],
    queryFn: () => MascotaService.getMascotasByOwner(ownerId),
    enabled: !!ownerId,
  });
};

export const useSearchMascotas = (query: string) => {
  return useQuery({
    queryKey: ["mascotas", "search", query],
    queryFn: () => MascotaService.searchMascotas(query),
    enabled: !!query,
  });
};
