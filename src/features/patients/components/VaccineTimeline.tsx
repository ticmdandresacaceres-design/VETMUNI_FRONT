"use client";

import type { Vacuna } from "../../vaccines/types";
import { Badge } from "@/components/ui/badge";
import { Syringe, CalendarDays, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";

interface VaccineTimelineProps {
  vacunas: Vacuna[];
  onAddVaccine?: () => void;
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("T")[0].split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getVaccineStatusInfo(expirationDate: string) {
  const now = new Date();
  const exp = parseLocalDate(expirationDate);
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: "Vencida", variant: "destructive" as const, icon: XCircle, days: Math.abs(diffDays) };
  }
  if (diffDays <= 30) {
    return { label: "Próxima a vencer", variant: "secondary" as const, icon: Clock, days: diffDays };
  }
  return { label: "Vigente", variant: "default" as const, icon: CheckCircle2, days: diffDays };
}

export default function VaccineTimeline({ vacunas, onAddVaccine }: VaccineTimelineProps) {
  const sorted = [...vacunas].sort(
    (a, b) => b.aplication_date.localeCompare(a.aplication_date)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Syringe className="w-5 h-5 text-primary" />
          Historial de Vacunas
        </h3>
        {onAddVaccine && (
          <button
            onClick={onAddVaccine}
            className="text-sm text-primary font-medium hover:underline"
          >
            + Agregar
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl bg-muted/10">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Syringe className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">Sin vacunas registradas</p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Este paciente aún no tiene vacunas en su historial
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-3">
            {sorted.map((vacuna, index) => {
              const status = getVaccineStatusInfo(vacuna.expiration_date);
              const StatusIcon = status.icon;

              return (
                <div key={vacuna.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-background ${
                    status.variant === "destructive" ? "bg-red-500" :
                    status.variant === "secondary" ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`} />

                  <div className="p-3.5 rounded-xl border bg-card hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${
                          status.variant === "destructive" ? "bg-red-500/10" :
                          status.variant === "secondary" ? "bg-amber-500/10" :
                          "bg-emerald-500/10"
                        }`}>
                          <Syringe className={`w-4 h-4 ${
                            status.variant === "destructive" ? "text-red-600 dark:text-red-400" :
                            status.variant === "secondary" ? "text-amber-600 dark:text-amber-400" :
                            "text-emerald-600 dark:text-emerald-400"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{vacuna.type}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <CalendarDays className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(vacuna.aplication_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={status.variant} className="text-[10px] px-1.5 py-0">
                          <StatusIcon className="w-3 h-3 mr-0.5 inline" />
                          {status.label}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Vence: {formatDate(vacuna.expiration_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
