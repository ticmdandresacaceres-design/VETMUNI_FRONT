import { useMemo } from "react";
import { useMascota, useMascotas, useGetMascotasByOwner } from "../hooks/useMascotas";
import { useVacunasPorMascota } from "../../vaccines/hooks/useVacunas";
import { useDueno } from "../../owners/hooks/useDuenos";
import { useVaccineAlerts, useUnvaccinatedPets } from "../../dashboard/hooks/useStats";
import type { VaccineStatus, VaccineStatusInfo } from "../types";
import type { Mascota } from "../types";
import type { Vacuna } from "../../vaccines/types";

export type { Mascota } from "../types";
export type { Dueno } from "../../owners/types";
export type { Vacuna } from "../../vaccines/types";
export { useMascotas, useGetMascotasByOwner } from "../hooks/useMascotas";
export { useMascota } from "../hooks/useMascotas";
export { useDueno, useDuenos, useCreateDueno, useUpdateDueno, useDeleteDueno } from "../../owners/hooks/useDuenos";
export { useVacunasPorMascota, useCreateVacuna, useDeleteVacuna } from "../../vaccines/hooks/useVacunas";
export { useCreateMascota, useUpdateMascota, useDeleteMascota, useSearchMascotas } from "../hooks/useMascotas";
export { useVaccineAlerts, useUnvaccinatedPets, useDashboardStats, useMonthlyActivity, useSpeciesDistribution } from "../../dashboard/hooks/useStats";
export { useDueno as useOwner } from "../../owners/hooks/useDuenos";

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
