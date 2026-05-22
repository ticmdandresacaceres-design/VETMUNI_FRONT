"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PawPrint, Users, Shield, AlertCircle } from "lucide-react";
import { useDashboardStats } from "@/src/features/dashboard/hooks/useStats";

const cards = [
  {
    label: "Total Mascotas",
    key: "total_pets" as const,
    icon: PawPrint,
    color: "primary",
    sub: "Pacientes registrados",
  },
  {
    label: "Dueños Activos",
    key: "total_owners" as const,
    icon: Users,
    color: "emerald",
    sub: "Clientes con cuenta activa",
  },
  {
    label: "Vacunas del Mes",
    key: "vaccinated_this_month" as const,
    icon: Shield,
    color: "blue",
    sub: "Aplicadas este mes",
  },
  {
    label: "Próximas a vencer",
    key: "upcoming_in_30_days" as const,
    icon: AlertCircle,
    color: "amber",
    sub: "En los próximos 30 días",
  },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

export function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const colors = colorMap[card.color];
        const value = data?.[card.key] ?? 0;

        return (
          <Card key={card.key} className={`overflow-hidden border ${colors}`}>
            <CardContent className="p-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
