import { useQuery } from "@tanstack/react-query";
import * as StatsService from "../service/StatsService";

export const statsKeys = {
  all: ["stats"] as const,
  dashboard: () => [...statsKeys.all, "dashboard"] as const,
  vaccineAlerts: () => [...statsKeys.all, "vaccine-alerts"] as const,
  unvaccinated: () => [...statsKeys.all, "unvaccinated"] as const,
  monthlyActivity: () => [...statsKeys.all, "monthly-activity"] as const,
  speciesDistribution: () => [...statsKeys.all, "species-distribution"] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: StatsService.getDashboardStats,
  });
};

export const useVaccineAlerts = () => {
  return useQuery({
    queryKey: statsKeys.vaccineAlerts(),
    queryFn: StatsService.getVaccineAlerts,
  });
};

export const useUnvaccinatedPets = () => {
  return useQuery({
    queryKey: statsKeys.unvaccinated(),
    queryFn: StatsService.getUnvaccinatedPets,
  });
};

export const useMonthlyActivity = () => {
  return useQuery({
    queryKey: statsKeys.monthlyActivity(),
    queryFn: StatsService.getMonthlyActivity,
  });
};

export const useSpeciesDistribution = () => {
  return useQuery({
    queryKey: statsKeys.speciesDistribution(),
    queryFn: StatsService.getSpeciesDistribution,
  });
};
