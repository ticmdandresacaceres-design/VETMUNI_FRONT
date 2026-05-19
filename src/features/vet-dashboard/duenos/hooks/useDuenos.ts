import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as DuenoService from "../service/DuenoService";
import { CreateDuenoRequest, UpdateDuenoRequest } from "../types";
import { toast } from "sonner";

export const duenoKeys = {
  all: ["duenos"] as const,
  lists: () => [...duenoKeys.all, "list"] as const,
  details: () => [...duenoKeys.all, "detail"] as const,
  detail: (id: string) => [...duenoKeys.details(), id] as const,
};

export const useDuenos = () => {
  return useQuery({
    queryKey: duenoKeys.lists(),
    queryFn: DuenoService.getDuenos,
  });
};

export const useDueno = (id: string) => {
  return useQuery({
    queryKey: duenoKeys.detail(id),
    queryFn: () => DuenoService.getDuenoById(id),
    enabled: !!id,
  });
};

export const useCreateDueno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDuenoRequest) => DuenoService.createDueno(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duenoKeys.lists() });
      toast.success("Dueño creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el dueño");
    },
  });
};

export const useUpdateDueno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDuenoRequest }) =>
      DuenoService.updateDueno(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: duenoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: duenoKeys.detail(id) });
      toast.success("Dueño actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el dueño");
    },
  });
};

export const useDeleteDueno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DuenoService.deleteDueno(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duenoKeys.lists() });
      toast.success("Dueño eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el dueño");
    },
  });
};
