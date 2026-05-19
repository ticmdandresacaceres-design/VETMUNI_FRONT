
export type DashboardStatsResource = {
  total_pets: number;
  total_owners: number;
  vaccinated_this_month: number;
  overdue_vaccines: number;
  upcoming_in_30_days: number;
  unvaccinated_count: number;
}

export type MonthlyActivityResource = {
  month: string;
  month_key: string;
  new_pets: number;
  vaccined_applied: number;
}



