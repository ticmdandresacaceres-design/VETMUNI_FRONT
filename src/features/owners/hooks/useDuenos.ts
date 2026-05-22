import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as DuenoService from "../services/DuenoService";
import { CreateDuenoRequest, UpdateDuenoRequest } from "../types";
import { ApiError } from "@/src/lib/api/axios";
import { toast } from "sonner";

export const duenoKeys = {
  all: ["duenos"] as const,
  lists: (params?: DuenoService.GetDuenosParams) => [...duenoKeys.all, "list", params] as const,
  details: () => [...duenoKeys.all, "detail"] as const,
  detail: (id: string) => [...duenoKeys.details(), id] as const,
};

export const useDuenos = (params?: DuenoService.GetDuenosParams) => {
  return useQuery({
    queryKey: duenoKeys.lists(params),
    queryFn: () => DuenoService.getDuenos(params),
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
      console.error("Error al crear dueño:", error);
      const message = error instanceof ApiError && error.data?.message
        ? error.data.message
        : error.message;
      toast.error(message || "Error al crear el dueño");
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
