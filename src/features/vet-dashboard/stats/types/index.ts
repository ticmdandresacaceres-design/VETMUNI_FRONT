
export interface DashboardStats {
  total_pets: number;
  total_vaccines_applied: number;
  active_owners: number;
  total_veterinarians: number;
  upcoming_vaccine_alerts: number;
  unvaccinated_pets: number;
}

export interface VaccineAlert {
  pet_id: string;
  pet_name: string;
  vaccine_type: string;
  expiration_date: string;
  days_until_expiration: number;
  status: 'alert' | 'urgent';
}

export interface UnvaccinatedPet {
  id: string;
  name: string;
  species: string;
  race: string;
  owner_name: string;
  owner_phone: string;
}

export interface MonthlyActivity {
  month: string;
  new_pets: number;
  vaccines_applied: number;
}

export interface SpeciesDistribution {
  species: string;
  count: number;
  percentage: number;
}

export interface StatsResponse<T> {
  data: T;
}
