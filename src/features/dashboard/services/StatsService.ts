import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type {
  DashboardStats,
  VaccineAlert,
  UnvaccinatedPet,
  MonthlyActivity,
  SpeciesDistribution,
  PaginatedResponse,
} from "../types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>(ENDPOINTS.stats.dashboard);
  return response.data ?? {
    total_pets: 0,
    total_owners: 0,
    vaccinated_this_month: 0,
    overdue_vaccines: 0,
    upcoming_in_30_days: 0,
    unvaccinated_count: 0,
  };
}

export async function getVaccineAlerts(): Promise<VaccineAlert[]> {
  const response = await apiClient.get<PaginatedResponse<VaccineAlert>>(ENDPOINTS.stats.vaccinesAlerts);
  return response.data?.data ?? [];
}

export async function getUnvaccinatedPets(): Promise<UnvaccinatedPet[]> {
  const response = await apiClient.get<PaginatedResponse<UnvaccinatedPet>>(ENDPOINTS.stats.unvaccinated);
  return response.data?.data ?? [];
}

export async function getMonthlyActivity(): Promise<MonthlyActivity[]> {
  const response = await apiClient.get<MonthlyActivity[]>(ENDPOINTS.stats.monthlyActivity);
  return response.data ?? [];
}

export async function getSpeciesDistribution(): Promise<SpeciesDistribution[]> {
  const response = await apiClient.get<PaginatedResponse<SpeciesDistribution>>(ENDPOINTS.stats.speciesDistribution);
  return response.data?.data ?? [];
}
