import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as MascotaService from "../services/MascotaService";
import { useVacunasPorMascota } from "../../vaccines/hooks/useVacunas";
import { useDueno } from "../../owners/hooks/useDuenos";
import type { CreateMascotaRequest, UpdateMascotaRequest, VaccineStatus, VaccineStatusInfo } from "../types";
import type { Mascota } from "../types";
import type { Vacuna } from "../../vaccines/types";
import { toast } from "sonner";

// --- Query Keys ---

export const mascotaKeys = {
  all: ["mascotas"] as const,
  lists: (params?: MascotaService.GetMascotasParams) => [...mascotaKeys.all, "list", params] as const,
  details: () => [...mascotaKeys.all, "detail"] as const,
  detail: (id: string) => [...mascotaKeys.details(), id] as const,
  search: (query: string) => [...mascotaKeys.all, "search", query] as const,
};

// --- CRUD Hooks ---

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

// --- Image Hooks ---

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

// --- Query Hooks ---

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

// --- Vaccine Status Utilities ---

export function getVaccineStatus(vacunas: Vacuna[] | undefined): VaccineStatusInfo {
  if (!vacunas || vacunas.length === 0) {
    return { label: "Sin vacunas", status: "sin_vacunas" };
  }

  const now = new Date();
  let hasUpcoming = false;
  let hasOverdue = false;
  let nearestDate: Date | null = null;
  let nearestVacuna: Vacuna | null = null;

  for (const v of vacunas) {
    const [ey, em, ed] = v.expiration_date.split("T")[0].split("-").map(Number);
    const exp = new Date(ey, em - 1, ed);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (!nearestDate || exp < nearestDate) {
      nearestDate = exp;
      nearestVacuna = v;
    }

    if (diffDays < 0) {
      hasOverdue = true;
    } else if (diffDays <= 30) {
      hasUpcoming = true;
    }
  }

  if (hasOverdue) {
    return {
      label: "Vencida",
      status: "vencida",
      lastVaccineDate: nearestVacuna?.aplication_date,
      nextVaccineDate: nearestVacuna?.expiration_date,
      daysToNext: nearestDate ? Math.ceil((nearestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
    };
  }
  if (hasUpcoming) {
    return {
      label: "Próxima a vencer",
      status: "proxima",
      lastVaccineDate: nearestVacuna?.aplication_date,
      nextVaccineDate: nearestVacuna?.expiration_date,
      daysToNext: nearestDate ? Math.ceil((nearestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
    };
  }
  return {
    label: "Al día",
    status: "al_dia",
    lastVaccineDate: nearestVacuna?.aplication_date,
    nextVaccineDate: nearestVacuna?.expiration_date,
    daysToNext: nearestDate ? Math.ceil((nearestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
  };
}

export function useVacunaStatusForPet(petId: string) {
  const { data: vacunas } = useVacunasPorMascota(petId);
  return useMemo(() => getVaccineStatus(vacunas), [vacunas]);
}

export function useCombinedPetWithOwner(petId: string) {
  const { data: mascota, isLoading: petLoading } = useMascota(petId);
  const ownerId = mascota?.user_id ?? "";
  const { data: dueno, isLoading: ownerLoading } = useDueno(ownerId);
  const { data: vacunas, isLoading: vacunasLoading } = useVacunasPorMascota(petId);

  const vaccineInfo = useMemo(() => getVaccineStatus(vacunas), [vacunas]);

  return {
    mascota,
    dueno,
    vacunas: vacunas ?? [],
    vaccineInfo,
    isLoading: petLoading || ownerLoading || vacunasLoading,
  };
}
