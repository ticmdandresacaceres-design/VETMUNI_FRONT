"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/features/auth/context/AuthContext";
import {
  useDashboardStats,
  useVaccineAlerts,
  useUnvaccinatedPets,
  useMonthlyActivity,
} from "../hooks/useStats";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PawPrint,
  Syringe,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  XCircle,
  CheckCircle2,
  Users,
  TrendingUp,
  CalendarDays,
  ArrowRight,
  RefreshCw,
  Stethoscope,
  Dog,
  Cat,
  type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";

const MonthlyActivityMiniChart = dynamic(
  () => import("@/src/features/dashboard/components/MonthlyActivityMiniChart").then(m => ({ default: m.MonthlyActivityMiniChart })),
  { ssr: false, loading: () => <Card><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card> }
);

export default function NewDashboardContent() {
  const router = useRouter();
  const { user } = useAuthContext();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: alerts, isLoading: alertsLoading } = useVaccineAlerts();
  const { data: unvaccinated } = useUnvaccinatedPets();
  const { refetch: refetchMonthly } = useMonthlyActivity();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Buenos días" : currentHour < 18 ? "Buenas tardes" : "Buenas noches";

  const refetchAll = () => {
    refetchStats();
    refetchMonthly();
  };

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    const overdue = alerts.filter((a) => a.alert_type === "atrasada").slice(0, 3);
    const upcoming = alerts.filter((a) => a.alert_type === "próxima").slice(0, 2);
    return [...overdue, ...upcoming].slice(0, 5);
  }, [alerts]);

  const overdueCount = alerts?.filter((a) => a.alert_type === "atrasada").length ?? 0;
  const upcomingCount = alerts?.filter((a) => a.alert_type === "próxima").length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] || "Veterinario"}
          </h1>
          <p className="text-lg text-muted-foreground mt-1.5">
            Panel de control veterinario
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <CalendarDays className="w-4 h-4" />
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetchAll} className="gap-1.5">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
            <Stethoscope className="w-3.5 h-3.5" />
            Vet Dashboard
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={PawPrint}
          label="Total pacientes"
          value={stats?.total_pets ?? 0}
          sub="Registrados"
          color="primary"
        />
        <StatCard
          icon={Syringe}
          label="Vacunados este mes"
          value={stats?.vaccinated_this_month ?? 0}
          sub="Últimos 30 días"
          color="emerald"
        />
        <StatCard
          icon={XCircle}
          label="Vacunas vencidas"
          value={overdueCount}
          sub="Requieren atención"
          color="red"
        />
        <StatCard
          icon={Clock}
          label="Próximas a vencer"
          value={upcomingCount}
          sub="En los próximos 30 días"
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickActionCard
            icon={Plus}
            label="Registrar Paciente"
            sub="Nuevo registro completo"
            onClick={() => router.push("/dashboard/registro")}
            color="primary"
          />
          <QuickActionCard
            icon={Syringe}
            label="Registrar Vacuna"
            sub="Vacunar paciente existente"
            onClick={() => router.push("/dashboard/pacientes")}
            color="amber"
          />
          <QuickActionCard
            icon={Search}
            label="Buscar Paciente"
            sub="Encontrar por nombre o dueño"
            onClick={() => router.push("/dashboard/pacientes")}
            color="slate"
          />
        </div>
      </div>

      {/* Alerts + Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertas de vacunación
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => router.push("/dashboard/control-vacunas")}
              >
                Ver todas
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>

            {alertsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-sm font-medium">Sin alertas pendientes</p>
                <p className="text-xs text-muted-foreground">Todas las vacunas están al día</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.vaccine_id}
                    onClick={() => router.push(`/dashboard/pacientes/${alert.pet.id}`)}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      alert.alert_type === "atrasada" ? "bg-red-500/10" : "bg-amber-500/10"
                    }`}>
                      {alert.alert_type === "atrasada" ? (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium truncate">{alert.pet.name}</p>
                        <Badge variant="outline" className="text-[10px] h-4 px-1 capitalize">{alert.pet.species}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {alert.type} · {alert.owner.name}
                      </p>
                    </div>
                    <Badge variant={alert.alert_type === "atrasada" ? "destructive" : "secondary"} className="text-[10px] h-5 shrink-0">
                      {alert.alert_type === "atrasada" ? `-${alert.days_diff}d` : `${alert.days_diff}d`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Activity Mini Chart */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Actividad mensual
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => router.push("/dashboard/estadisticas")}
              >
                Ver más
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
            <MonthlyActivityMiniChart />
          </CardContent>
        </Card>
      </div>

      {/* Unvaccinated + Stats row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unvaccinated pets */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Pacientes sin vacunar
              </h3>
              {unvaccinated && unvaccinated.length > 0 && (
                <Badge variant="secondary">{unvaccinated.length}</Badge>
              )}
            </div>
            {unvaccinated && unvaccinated.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-2">
                {unvaccinated.slice(0, 6).map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => router.push(`/dashboard/pacientes/${pet.id}`)}
                    className="flex items-center gap-3 p-2.5 rounded-lg border hover:border-primary/30 hover:bg-muted/20 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {pet.species.toLowerCase() === "perro" ? (
                        <Dog className="w-4 h-4 text-muted-foreground" />
                      ) : pet.species.toLowerCase() === "gato" ? (
                        <Cat className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <PawPrint className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pet.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{pet.owner.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Todos los pacientes tienen vacunas</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick stats summary */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Resumen general
            </h3>
            <div className="space-y-3">
              <SummaryRow label="Total pacientes" value={stats?.total_pets ?? 0} />
              <SummaryRow label="Total dueños" value={stats?.total_owners ?? 0} />
              <SummaryRow label="Sin vacunar" value={stats?.unvaccinated_count ?? 0} />
              {stats && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    onClick={() => router.push("/dashboard/estadisticas")}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Ver estadísticas completas
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  sub: string;
  color: "primary" | "emerald" | "red" | "amber";
}) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };

  return (
    <Card className={`overflow-hidden border ${colors[color]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <Icon className="w-4 h-4" />
        </div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  sub,
  onClick,
  color,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  onClick: () => void;
  color: "primary" | "amber" | "slate";
}) {
  const colors: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 border-primary/20",
    amber: "from-amber-500/10 to-amber-500/5 hover:from-amber-500/15 hover:to-amber-500/10 border-amber-500/20",
    slate: "from-slate-500/10 to-slate-500/5 hover:from-slate-500/15 hover:to-slate-500/10 border-slate-500/20",
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-br ${colors[color]} cursor-pointer transition-all hover:shadow-sm`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        color === "primary" ? "bg-primary/20 text-primary" :
        color === "amber" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
        "bg-slate-500/20 text-slate-600 dark:text-slate-400"
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}


