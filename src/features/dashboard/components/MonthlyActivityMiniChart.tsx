"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyActivity } from "@/src/features/dashboard/hooks/useStats";

const chartConfig = {
  vaccines_applied: {
    label: "Vacunas aplicadas",
    color: "hsl(220, 70%, 50%)",
  },
} satisfies ChartConfig;

export function MonthlyActivityMiniChart() {
  const { data: monthlyActivity, isLoading } = useMonthlyActivity();
  const last6 = monthlyActivity?.slice(-6) ?? [];
  const totalVaccines = last6.reduce((sum, item) => sum + item.vaccines_applied, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Vacunas Últimos Meses</CardTitle>
        <CardDescription>Actividad reciente de vacunación</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ) : last6.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <BarChart data={last6}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="vaccines_applied"
                  fill="hsl(220, 70%, 50%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Badge variant="secondary" className="text-xs">
                Total: {totalVaccines}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
