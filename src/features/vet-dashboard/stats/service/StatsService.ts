import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import type { 
  DashboardStats, 
  VaccineAlert, 
  UnvaccinatedPet, 
  MonthlyActivity, 
  SpeciesDistribution,
  StatsResponse 
} from "../types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<StatsResponse<DashboardStats>>(ENDPOINTS.stats.dashboard);
  return response.data.data;
}

export async function getVaccineAlerts(): Promise<VaccineAlert[]> {
  const response = await apiClient.get<StatsResponse<VaccineAlert[]>>(ENDPOINTS.stats.vaccinesAlerts);
  return response.data.data;
}

export async function getUnvaccinatedPets(): Promise<UnvaccinatedPet[]> {
  const response = await apiClient.get<StatsResponse<UnvaccinatedPet[]>>(ENDPOINTS.stats.unvaccinated);
  return response.data.data;
}

export async function getMonthlyActivity(): Promise<MonthlyActivity[]> {
  const response = await apiClient.get<StatsResponse<MonthlyActivity[]>>(ENDPOINTS.stats.monthlyActivity);
  return response.data.data;
}

export async function getSpeciesDistribution(): Promise<SpeciesDistribution[]> {
  const response = await apiClient.get<StatsResponse<SpeciesDistribution[]>>(ENDPOINTS.stats.speciesDistribution);
  return response.data.data;
}
