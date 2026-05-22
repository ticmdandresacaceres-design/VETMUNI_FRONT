
export interface DashboardStats {
  total_pets: number;
  total_owners: number;
  vaccinated_this_month: number;
  overdue_vaccines: number;
  upcoming_in_30_days: number;
  unvaccinated_count: number;
}

export interface VaccineAlertPet {
  id: string;
  name: string;
  species: string;
  race: string;
}

export interface VaccineAlertOwner {
  id: string;
  name: string;
  phone: string;
}

export interface VaccineAlert {
  vaccine_id: string;
  type: string;
  alert_type: "atrasada" | "próxima";
  days_diff: number;
  application_date: string;
  next_vaccine_date: string;
  months_validity: number;
  pet: VaccineAlertPet;
  owner: VaccineAlertOwner;
}

export interface UnvaccinatedPetOwner {
  id: string;
  name: string;
  phone: string;
}

export interface UnvaccinatedPet {
  id: string;
  name: string;
  species: string;
  race: string;
  status: string;
  registered_at: string;
  owner: UnvaccinatedPetOwner;
}

export interface MonthlyActivity {
  month: string;
  month_key: string;
  new_pets: number;
  vaccines_applied: number;
}

export interface SpeciesDistribution {
  species: string;
  total: number;
  percentage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
