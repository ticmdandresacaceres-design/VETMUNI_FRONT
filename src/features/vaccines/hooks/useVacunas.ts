import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as VacunaService from "../services/VacunaService";
import { CreateVacunaRequest, UpdateVacunaRequest } from "../types";
import { toast } from "sonner";

export const vacunaKeys = {
  all: ["vacunas"] as const,
  lists: (params?: VacunaService.GetVacunasParams) => [...vacunaKeys.all, "list", params] as const,
  byPet: (petId: string) => [...vacunaKeys.all, "pet", petId] as const,
  details: () => [...vacunaKeys.all, "detail"] as const,
  detail: (id: string) => [...vacunaKeys.details(), id] as const,
};

export const useVacunas = (params?: VacunaService.GetVacunasParams) => {
  return useQuery({
    queryKey: vacunaKeys.lists(params),
    queryFn: () => VacunaService.getVacunas(params),
    placeholderData: keepPreviousData,
  });
};

export const useVacunasPorMascota = (petId: string) => {
  return useQuery({
    queryKey: vacunaKeys.byPet(petId),
    queryFn: () => VacunaService.getVacunasPorMascota(petId),
    enabled: !!petId,
  });
};

export const useVacuna = (id: string) => {
  return useQuery({
    queryKey: vacunaKeys.detail(id),
    queryFn: () => VacunaService.getVacunaById(id),
    enabled: !!id,
  });
};

export const useCreateVacuna = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVacunaRequest) => VacunaService.createVacuna(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vacunaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vacunaKeys.byPet(variables.pet_id) });
      toast.success("Vacuna registrada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar la vacuna");
    },
  });
};

export const useUpdateVacuna = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVacunaRequest }) =>
      VacunaService.updateVacuna(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: vacunaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vacunaKeys.detail(id) });
      if (data.pet_id) {
        queryClient.invalidateQueries({ queryKey: vacunaKeys.byPet(data.pet_id) });
      }
      toast.success("Vacuna actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar la vacuna");
    },
  });
};

export const useDeleteVacuna = (petId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VacunaService.deleteVacuna(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacunaKeys.lists() });
      if (petId) {
        queryClient.invalidateQueries({ queryKey: vacunaKeys.byPet(petId) });
      }
      toast.success("Vacuna eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la vacuna");
    },
  });
};
