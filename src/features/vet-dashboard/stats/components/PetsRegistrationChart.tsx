import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { MonthlyActivity } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PetsRegistrationChartProps {
    data: MonthlyActivity[];
}

const chartConfig = {
    new_pets: {
        label: 'Mascotas registradas',
        color: 'hsl(142, 76%, 36%)',
    },
} satisfies ChartConfig;

export function PetsRegistrationChart({ data }: PetsRegistrationChartProps) {
    const totalMascotas = data.reduce((sum, item) => sum + item.new_pets, 0);
    
    // Calcular tendencia (comparando los últimos dos meses)
    const ultimosDos = data.slice(-2);
    let tendencia = 'stable';
    let IconoTendencia = Minus;
    let colorTendencia = 'text-slate-500';
    
    if (ultimosDos.length === 2) {
        const [penultimo, ultimo] = ultimosDos;
        if (ultimo.new_pets > penultimo.new_pets) {
            tendencia = 'up';
            IconoTendencia = TrendingUp;
            colorTendencia = 'text-emerald-600';
        } else if (ultimo.new_pets < penultimo.new_pets) {
            tendencia = 'down';
            IconoTendencia = TrendingDown;
            colorTendencia = 'text-red-500';
        }
    }

    return (
        <Card className="col-span-full">
            <CardHeader className="pb-4 space-y-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                        Registros Mensuales
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <IconoTendencia className={`w-4 h-4 ${colorTendencia}`} />
                        <span className={`text-sm font-medium ${colorTendencia}`}>
                            {tendencia === 'up' && 'Creciente'}
                            {tendencia === 'down' && 'Decreciente'}
                            {tendencia === 'stable' && 'Estable'}
                        </span>
                    </div>
                </div>
                <CardDescription className="text-xs">
                    Nuevas mascotas registradas por mes
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
                <ChartContainer config={chartConfig} className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent 
                                    hideLabel={false}
                                    indicator="dot"
                                    labelFormatter={(value) => `Mes: ${value}`}
                                    className="rounded-lg p-3"
                                />}
                            />
                            <XAxis 
                                dataKey="month"
                                tickLine={false}
                                tickMargin={8}
                                axisLine={false}
                                fontSize={10}
                                tick={{ fill: '#64748b' }}
                            />
                            <YAxis 
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={10}
                                tick={{ fill: '#64748b' }}
                                width={30}
                            />
                            <defs>
                                <linearGradient id="fillTotalCompact" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.05}/>
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="new_pets"
                                type="monotone"
                                fill="url(#fillTotalCompact)"
                                fillOpacity={1}
                                stroke="hsl(142, 76%, 36%)"
                                strokeWidth={2.5}
                                dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 0, r: 3 }}
                                activeDot={{ r: 4, stroke: 'hsl(142, 76%, 36%)', strokeWidth: 2, fill: 'white' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Badge 
                        variant="secondary" 
                        className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border-0"
                    >
                        Total Periodo: {totalMascotas.toLocaleString()}
                    </Badge>
                    {ultimosDos.length > 0 && (
                        <Badge 
                            variant="outline" 
                            className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50"
                        >
                            Último mes: {ultimosDos[ultimosDos.length - 1].new_pets}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}