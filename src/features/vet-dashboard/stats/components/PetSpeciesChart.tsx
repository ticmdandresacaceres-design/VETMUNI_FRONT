"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { SpeciesDistribution } from '../types';

interface PetSpeciesChartProps {
    data: SpeciesDistribution[];
}

const COLORS = [
    'hsl(220, 70%, 50%)',
    'hsl(340, 75%, 50%)',
    'hsl(142, 70%, 45%)',
    'hsl(48, 96%, 53%)',
    'hsl(262, 83%, 58%)',
];

export function PetSpeciesChart({ data }: PetSpeciesChartProps) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    const chartConfig: ChartConfig = data.reduce((config, item, index) => {
        config[item.species.toLowerCase()] = {
            label: item.species,
            color: COLORS[index % COLORS.length],
        };
        return config;
    }, {} as ChartConfig);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-lg">Mascotas por Especie</CardTitle>
                <CardDescription className="text-xs">
                    Distribución de mascotas registradas
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer 
                    config={chartConfig} 
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="species"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            label={({ species, percentage }) => 
                                `${species} ${percentage}%`
                            }
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-1 mt-4 justify-center">
                    {data.map((item, index) => (
                        <Badge key={item.species} variant="outline" className="text-xs">
                            <div 
                                className="w-2 h-2 rounded-full mr-1.5" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {item.species}: {item.count}
                        </Badge>
                    ))}
                    <Badge variant="secondary" className="text-xs font-semibold">
                        Total: {total}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}