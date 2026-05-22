"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeciesDistribution, useDashboardStats } from "@/src/features/dashboard/hooks/useStats";

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(340, 75%, 50%)",
  "hsl(142, 70%, 45%)",
  "hsl(48, 96%, 53%)",
  "hsl(262, 83%, 58%)",
  "hsl(199, 89%, 48%)",
  "hsl(0, 84%, 60%)",
];

export function SpeciesPieChart() {
  const { data, isLoading } = useSpeciesDistribution();
  const { data: stats } = useDashboardStats();
  const total = stats?.total_pets ?? 0;

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-lg">Mascotas por Especie</CardTitle>
        <CardDescription>Distribución de mascotas registradas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-64 rounded-full mx-auto" />
            <div className="flex flex-wrap gap-2 justify-center">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={data.reduce((config, item, index) => {
                config[item.species.toLowerCase()] = {
                  label: item.species,
                  color: COLORS[index % COLORS.length],
                };
                return config;
              }, {} as ChartConfig)}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="species"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  label={({ species, percentage }) => `${species} ${percentage}%`}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {data.map((item, index) => (
                <Badge key={item.species} variant="outline" className="text-xs">
                  <div
                    className="w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.species}: {item.total}
                </Badge>
              ))}
              <Badge variant="secondary" className="text-xs font-semibold">
                Total: {total}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
