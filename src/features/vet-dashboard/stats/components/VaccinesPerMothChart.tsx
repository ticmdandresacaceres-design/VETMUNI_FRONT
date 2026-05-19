import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { MonthlyActivity } from '../types';

interface VaccinesPerMonthChartProps {
    data: MonthlyActivity[];
}

const chartConfig = {
    vaccines_applied: {
        label: 'Vacunas',
        color: 'hsl(142, 76%, 36%)',
    },
} satisfies ChartConfig;

export function VaccinesPerMonthChart({ data }: VaccinesPerMonthChartProps) {
    const totalVaccines = data.reduce((sum, item) => sum + item.vaccines_applied, 0);
    const busiestMonth = data.length > 0 
        ? data.reduce((prev, current) => prev.vaccines_applied > current.vaccines_applied ? prev : current)
        : null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Vacunas por Mes</CardTitle>
                <CardDescription className="text-xs">
                    Distribución mensual de vacunas aplicadas
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="min-h-40">
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <XAxis 
                            dataKey="month"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            fontSize={10}
                        />
                        <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tickMargin={6}
                            fontSize={10}
                        />
                        <Bar 
                            dataKey="vaccines_applied" 
                            fill="hsl(142, 76%, 36%)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-1 mt-3">
                    <Badge variant="secondary" className="text-xs">
                        Total: {totalVaccines}
                    </Badge>
                    {busiestMonth && busiestMonth.vaccines_applied > 0 && (
                        <Badge variant="outline" className="text-xs">
                            Pico: {busiestMonth.month} ({busiestMonth.vaccines_applied})
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}