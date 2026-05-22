import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as VetService from "../services/VetService";
import { CreateVeterinarioRequest, UpdateVeterinarioRequest } from "../types";
import { toast } from "sonner";

export const vetKeys = {
  all: ["veterinarios"] as const,
  lists: () => [...vetKeys.all, "list"] as const,
  details: () => [...vetKeys.all, "detail"] as const,
  detail: (id: string) => [...vetKeys.details(), id] as const,
};

export const useVeterinarios = () => {
  return useQuery({
    queryKey: vetKeys.lists(),
    queryFn: VetService.getVeterinarians,
  });
};

export const useVeterinario = (id: string) => {
  return useQuery({
    queryKey: vetKeys.detail(id),
    queryFn: () => VetService.getVeterinarianById(id),
    enabled: !!id,
  });
};

export const useCreateVeterinario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVeterinarioRequest) => VetService.createVeterinarian(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vetKeys.lists() });
      toast.success("Veterinario creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el veterinario");
    },
  });
};

export const useUpdateVeterinario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVeterinarioRequest }) =>
      VetService.updateVeterinarian(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: vetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vetKeys.detail(id) });
      toast.success("Veterinario actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el veterinario");
    },
  });
};

export const useDeleteVeterinario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VetService.deleteVeterinarian(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vetKeys.lists() });
      toast.success("Veterinario eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el veterinario");
    },
  });
};
