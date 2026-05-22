"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, PawPrint } from "lucide-react";
import { useVaccineAlerts } from "@/src/features/dashboard/hooks/useStats";
import { formatDate } from "@/src/lib/utils/utils";

type FilterStatus = "all" | "atrasada" | "próxima";

export function VaccineAlertsTable() {
  const { data, isLoading } = useVaccineAlerts();
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered = data?.filter((alert) =>
    filter === "all" ? true : alert.alert_type === filter
  ) ?? [];

  const atrasadasCount = data?.filter((a) => a.alert_type === "atrasada").length ?? 0;
  const proximasCount = data?.filter((a) => a.alert_type === "próxima").length ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alertas de Vacunas
            </CardTitle>
            <CardDescription>Vacunas próximas a vencer</CardDescription>
          </div>
          {data && (
            <Badge variant="secondary">{data.length} registros</Badge>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            Todos ({data?.length ?? 0})
          </Badge>
          <Badge
            variant={filter === "atrasada" ? "destructive" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("atrasada")}
          >
            Atrasadas ({atrasadasCount})
          </Badge>
          <Badge
            variant={filter === "próxima" ? "secondary" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("próxima")}
          >
            Próximas ({proximasCount})
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No hay alertas con este filtro</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Tipo de Vacuna</TableHead>
                  <TableHead>Próxima Vacuna</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((alert) => (
                  <TableRow key={alert.vaccine_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-muted-foreground" />
                        {alert.pet.name}
                      </div>
                    </TableCell>
                    <TableCell>{alert.pet.species}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>{formatDate(alert.next_vaccine_date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.alert_type === "atrasada" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {alert.days_diff < 0 ? `${Math.abs(alert.days_diff)} días atrasada` : `${alert.days_diff} días`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.alert_type === "atrasada" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {alert.alert_type === "atrasada" ? "Atrasada" : "Próxima"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
