'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Loader2, FileSpreadsheet, Users, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { useExport } from '../hooks/useExport';
import SelectDueno from '../../mascotas/components/SelectDueno';
import { DuenoProvider } from '../../duenos/context/DuenoContext';

function ExportClient() {
    const [duenoId, setDuenoId] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear());
    const { exportVacunasByDueno, exportAllVacunas, isLoading } = useExport();

    const handleExportByDueno = () => {
        if (duenoId.trim()) {
            exportVacunasByDueno(duenoId.trim());
        }
    };

    const handleExportAll = () => {
        exportAllVacunas(anio);
    };

    const handleAnioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setAnio(value);
        }
    };

    return (
        <DuenoProvider>
            <div className="max-w-7xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <FileSpreadsheet className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Exportar Reportes</h1>
                            <p className="text-muted-foreground">Genera reportes de vacunación en formato Excel</p>
                        </div>
                    </div>
                </div>

                {/* Export Cards Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Exportar por Dueño */}
                    <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Users className="h-5 w-5 text-primary" />
                                        Reporte Individual
                                    </CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
                                        Exporta el historial completo de vacunación de las mascotas de un propietario específico
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="shrink-0">
                                    Por Dueño
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-3">
                                <Label htmlFor="duenoSelect" className="text-sm font-medium">
                                    Seleccionar Propietario
                                </Label>
                                <SelectDueno
                                    value={duenoId}
                                    onValueChange={setDuenoId}
                                    placeholder="Buscar por nombre o DNI..."
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5" />
                                    El reporte incluirá todas las mascotas del propietario
                                </p>
                            </div>
                            
                            <div className="pt-2">
                                <Button
                                    onClick={handleExportByDueno}
                                    disabled={!duenoId.trim() || isLoading}
                                    className="w-full gap-2 shadow-sm"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generando Excel...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Descargar Reporte Individual
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exportar Todos por Año */}
                    <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Reporte Anual Completo
                                    </CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
                                        Exporta el registro completo de todas las vacunaciones realizadas durante un año específico
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="shrink-0">
                                    Por Año
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-3">
                                <Label htmlFor="anio" className="text-sm font-medium">
                                    Año del Reporte
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="anio"
                                        type="number"
                                        value={anio}
                                        onChange={handleAnioChange}
                                        min={2000}
                                        max={new Date().getFullYear() + 5}
                                        disabled={isLoading}
                                        className="pl-10 h-11"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5" />
                                    Se incluirán todas las vacunas aplicadas en {anio}
                                </p>
                            </div>
                            
                            <div className="pt-2">
                                <Button
                                    onClick={handleExportAll}
                                    disabled={isLoading}
                                    className="w-full gap-2 shadow-sm"
                                    size="lg"
                                    variant="outline"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generando Excel...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Descargar Reporte {anio}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Información y Guía */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Características */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-primary" />
                                Características de los Reportes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        icon: FileSpreadsheet,
                                        title: "Formato Excel",
                                        description: "Archivos .xlsx compatibles con cualquier software de hojas de cálculo"
                                    },
                                    {
                                        icon: CheckCircle2,
                                        title: "Datos Completos",
                                        description: "Incluye información detallada de vacunas, mascotas y propietarios"
                                    },
                                    {
                                        icon: Calendar,
                                        title: "Filtrado por Fecha",
                                        description: "Los reportes anuales filtran automáticamente por año de aplicación"
                                    },
                                    {
                                        icon: Download,
                                        title: "Descarga Automática",
                                        description: "El archivo se descarga inmediatamente al completarse"
                                    }
                                ].map((feature, index) => (
                                    <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                        <div className="p-2 bg-background rounded-lg h-fit">
                                            <feature.icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{feature.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Info className="h-5 w-5 text-primary" />
                                Consejos Útiles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {[
                                    "Usa el buscador para encontrar rápidamente por nombre o DNI",
                                    "Los reportes anuales son ideales para estadísticas oficiales",
                                    "Verifica los permisos de descarga en tu navegador",
                                    "Los archivos se guardan automáticamente en tu carpeta de Descargas"
                                ].map((tip, index) => (
                                    <li key={index} className="flex gap-2">
                                        <span className="text-primary font-bold shrink-0">•</span>
                                        <span className="text-muted-foreground leading-relaxed">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Status/Info Banner */}
                {isLoading && (
                    <Card className="border-primary bg-primary/5">
                        <CardContent className="flex items-center gap-3 p-4">
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                            <div>
                                <p className="font-medium">Generando reporte Excel...</p>
                                <p className="text-sm text-muted-foreground">
                                    Por favor espera mientras se procesa la información
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DuenoProvider>
    );
}

export default ExportClient;