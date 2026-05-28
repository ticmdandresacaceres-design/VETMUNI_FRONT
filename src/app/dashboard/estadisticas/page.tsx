"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { StatsCards } from "@/src/features/dashboard/components/StatsCards";
import dynamic from "next/dynamic";
import { UnvaccinatedPetsTable } from "@/src/features/dashboard/components/UnvaccinatedPetsTable";
import { VaccineAlertsTable } from "@/src/features/dashboard/components/VaccineAlertsTable";
import { useDashboardStats, useMonthlyActivity, useSpeciesDistribution, useVaccineAlerts, useUnvaccinatedPets } from "@/src/features/dashboard/hooks/useStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SpeciesPieChart = dynamic(
  () => import("@/src/features/dashboard/components/SpeciesPieChart").then(m => ({ default: m.SpeciesPieChart })),
  { ssr: false, loading: () => <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card> }
);

const MonthlyActivityChart = dynamic(
  () => import("@/src/features/dashboard/components/MonthlyActivityChart").then(m => ({ default: m.MonthlyActivityChart })),
  { ssr: false, loading: () => <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card> }
);

export default function EstadisticasPage() {
  const { refetch: refetchDashboard, error: dashboardError } = useDashboardStats();
  const { refetch: refetchMonthly } = useMonthlyActivity();
  const { refetch: refetchSpecies } = useSpeciesDistribution();
  const { refetch: refetchAlerts } = useVaccineAlerts();
  const { refetch: refetchUnvaccinated } = useUnvaccinatedPets();

  const refetchAll = () => {
    refetchDashboard();
    refetchMonthly();
    refetchSpecies();
    refetchAlerts();
    refetchUnvaccinated();
  };

  if (dashboardError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error al cargar las estadísticas: {(dashboardError as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground mt-1">
            Análisis completo de la actividad veterinaria
          </p>
        </div>
        <Button onClick={refetchAll} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <SpeciesPieChart />
        <MonthlyActivityChart />
      </div>

      {/* Tables */}
      <VaccineAlertsTable />
      <UnvaccinatedPetsTable />
    </div>
  );
}
