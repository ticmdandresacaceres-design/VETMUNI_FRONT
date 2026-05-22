"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Clock, PawPrint } from "lucide-react";
import { useVaccineAlerts } from "@/src/features/dashboard/hooks/useStats";
import { formatDate } from "@/src/lib/utils/utils";

export function VaccineAlertsList() {
  const { data: alerts, isLoading } = useVaccineAlerts();
  const displayAlerts = alerts?.slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alertas de Vacunas
            </CardTitle>
            <CardDescription>Próximas a vencer</CardDescription>
          </div>
          {alerts && (
            <Badge variant="secondary">
              {alerts.length} total
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : displayAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayAlerts.map((alert) => (
              <div
                key={alert.vaccine_id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full ${
                  alert.alert_type === "atrasada"
                    ? "bg-red-100 text-red-600 dark:bg-red-500/20"
                    : "bg-amber-100 text-amber-600 dark:bg-amber-500/20"
                }`}>
                  <PawPrint className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.pet.name}</p>
                  <p className="text-xs text-muted-foreground">{alert.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(alert.next_vaccine_date)}
                  </div>
                  <Badge
                    variant={alert.alert_type === "atrasada" ? "destructive" : "secondary"}
                    className="mt-1 text-xs"
                  >
                    {alert.days_diff < 0 ? `${Math.abs(alert.days_diff)} días atrasada` : `${alert.days_diff} días`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
