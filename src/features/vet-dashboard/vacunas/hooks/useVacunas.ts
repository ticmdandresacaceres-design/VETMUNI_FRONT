import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as VacunaService from "../service/VacunaService";
import { CreateVacunaRequest, UpdateVacunaRequest } from "../types";
import { toast } from "sonner";

export const vacunaKeys = {
  all: ["vacunas"] as const,
  lists: () => [...vacunaKeys.all, "list"] as const,
  byPet: (petId: string) => [...vacunaKeys.lists(), "pet", petId] as const,
  details: () => [...vacunaKeys.all, "detail"] as const,
  detail: (id: string) => [...vacunaKeys.details(), id] as const,
};

export const useVacunas = () => {
  return useQuery({
    queryKey: vacunaKeys.lists(),
    queryFn: VacunaService.getVacunas,
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
    onSuccess: (newVacuna) => {
      queryClient.invalidateQueries({ queryKey: vacunaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vacunaKeys.byPet(newVacuna.pet_id) });
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
    onSuccess: (updatedVacuna, { id }) => {
      queryClient.invalidateQueries({ queryKey: vacunaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vacunaKeys.byPet(updatedVacuna.pet_id) });
      queryClient.invalidateQueries({ queryKey: vacunaKeys.detail(id) });
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
