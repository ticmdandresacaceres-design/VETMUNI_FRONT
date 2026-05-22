"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyActivity } from "@/src/features/dashboard/hooks/useStats";

const chartConfig = {
  new_pets: {
    label: "Nuevas mascotas",
    color: "hsl(142, 70%, 45%)",
  },
  vaccines_applied: {
    label: "Vacunas aplicadas",
    color: "hsl(220, 70%, 50%)",
  },
} satisfies ChartConfig;

export function MonthlyActivityChart() {
  const { data, isLoading } = useMonthlyActivity();
  const totalPets = data?.reduce((sum, item) => sum + item.new_pets, 0) ?? 0;
  const totalVaccines = data?.reduce((sum, item) => sum + item.vaccines_applied, 0) ?? 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Actividad Mensual</CardTitle>
        <CardDescription>Nuevas mascotas y vacunas aplicadas por mes</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : !data || data.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  width={40}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="new_pets"
                  fill="hsl(142, 70%, 45%)"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="vaccines_applied"
                  fill="hsl(220, 70%, 50%)"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <Badge variant="secondary" className="text-xs">
                Mascotas: {totalPets.toLocaleString()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Vacunas: {totalVaccines.toLocaleString()}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
