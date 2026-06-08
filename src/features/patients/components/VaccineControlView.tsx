"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useVaccineAlerts, useUnvaccinatedPets } from "../hooks/usePacientes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Syringe,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PawPrint,
  Search,
  FlaskConical,
  XCircle,
  Phone,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type AlertFilter = "todas" | "atrasada" | "próxima";

export default function VaccineControlView() {
  const router = useRouter();
  const [filter, setFilter] = useState<AlertFilter>("todas");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: alerts, isLoading: alertsLoading } = useVaccineAlerts();
  const { data: unvaccinated, isLoading: unvaccinatedLoading } = useUnvaccinatedPets();

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    let items = alerts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (a) =>
          a.pet.name.toLowerCase().includes(q) ||
          a.owner.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      );
    }
    if (filter === "atrasada") return items.filter((a) => a.alert_type === "atrasada");
    if (filter === "próxima") return items.filter((a) => a.alert_type === "próxima");
    return items;
  }, [alerts, filter, searchQuery]);

  const overdueCount = alerts?.filter((a) => a.alert_type === "atrasada").length ?? 0;
  const upcomingCount = alerts?.filter((a) => a.alert_type === "próxima").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Control de Vacunas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoreo de alertas y estado de vacunación
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/registro")} className="gap-2">
          <Syringe className="w-4 h-4" />
          Registrar Vacuna
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={AlertTriangle}
          label="Vacunas vencidas"
          value={overdueCount}
          variant="destructive"
        />
        <SummaryCard
          icon={Clock}
          label="Próximas a vencer"
          value={upcomingCount}
          variant="warning"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Pendientes de vacunar"
          value={unvaccinated?.length ?? 0}
          variant="default"
        />
        <SummaryCard
          icon={FlaskConical}
          label="Total alertas"
          value={alerts?.length ?? 0}
          variant="default"
        />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por mascota, dueño o vacuna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["todas", "atrasada", "próxima"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {f === "todas" ? "Todas" : f === "atrasada" ? "Vencidas" : "Próximas"}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      {alertsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h3 className="text-lg font-medium">Sin alertas pendientes</h3>
            <p className="text-sm text-muted-foreground">
              Todas las vacunas están al día
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.vaccine_id}
              onClick={() => router.push(`/dashboard/pacientes/${alert.pet.id}`)}
              className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-sm hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                alert.alert_type === "atrasada"
                  ? "bg-red-500/10"
                  : "bg-amber-500/10"
              }`}>
                {alert.alert_type === "atrasada" ? (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{alert.pet.name}</h4>
                  <Badge variant="outline" className="text-[10px] h-5 capitalize">
                    {alert.pet.species}
                  </Badge>
                  <Badge variant={alert.alert_type === "atrasada" ? "destructive" : "secondary"} className="text-[10px] h-5 shrink-0">
                    {alert.alert_type === "atrasada"
                      ? `Vencida hace ${alert.days_diff} días`
                      : `Vence en ${alert.days_diff} días`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{alert.type}</span>
                  {alert.application_date && (
                    <span> · Aplicada: {new Date(alert.application_date).toLocaleDateString("es-PE")}</span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <span>Dueño: {alert.owner.name}</span>
                  {alert.owner.phone && (
                    <>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {alert.owner.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end shrink-0">
                <Badge variant="outline" className="text-[10px] mb-1">
                  {alert.pet.race}
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unvaccinated Section */}
      {unvaccinated && unvaccinated.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Pacientes sin vacunas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unvaccinated.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => router.push(`/dashboard/pacientes/${pet.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 hover:bg-muted/20 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <PawPrint className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pet.name}</p>
                    <p className="text-xs text-muted-foreground">{pet.species} · {pet.owner.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  variant,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  variant: "default" | "destructive" | "warning";
}) {
  const colors = {
    default: "bg-primary/10 text-primary border-primary/20",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };

  return (
    <Card className={`overflow-hidden border ${colors[variant]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <Icon className={`w-4 h-4 ${variant === "default" ? "text-primary" : ""}`} />
        </div>
        <p className="text-2xl font-bold mt-1.5">{value}</p>
      </CardContent>
    </Card>
  );
}
