"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    Plus,
    ArrowRight,
    PawPrint,
    Shield,
    Activity,
    TrendingUp,
    UserCheck,
    Clock,
    Syringe,
    Heart
} from "lucide-react";
import { VetProvider, useVetContext } from "@/src/features/admin-dashboard/veterinarios/context/VetContext";
import { DuenoProvider, useDuenoContext } from "@/src/features/vet-dashboard/duenos/context/DuenoContext";
import { MascotaProvider, useMascotaContext } from "@/src/features/vet-dashboard/mascotas/context/MascotaContext";
import { VacunaProvider, useVacunaContext } from "@/src/features/vet-dashboard/vacunas/context/VacunaContext";
import { useAuthContext } from "@/src/features/auth/context/AuthContext";

function AdminDashboardContent() {
    const { user } = useAuthContext();
    const { data: veterinarians = [], isLoading: vetsLoading } = useVetContext();
    const { data: duenos = [], isLoading: duenosLoading } = useDuenoContext();
    const { data: mascotas = [], isLoading: mascotasLoading } = useMascotaContext();
    const { data: vacunas = [], isLoading: vacunasLoading } = useVacunaContext();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalVets = veterinarians.length;
    const activeVets = veterinarians.filter(vet => vet.active).length;
    const totalDuenos = duenos.length;
    const totalMascotas = mascotas.length;
    const totalVacunas = vacunas.length;

    const currentMonth = new Date().getMonth();
    const vacunasThisMonth = vacunas.filter(vacuna => {
        const vacunaDate = new Date(vacuna.aplication_date);
        return vacunaDate.getMonth() === currentMonth;
    }).length;

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Buenos días" : currentHour < 18 ? "Buenas tardes" : "Buenas noches";

    const isLoading = vetsLoading || duenosLoading || mascotasLoading || vacunasLoading;

    if (!isMounted) {
        return <AdminLoadingSkeleton />;
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {greeting}, {user?.name || "Admin"} 👋
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">
                            Tu clínica veterinaria en un vistazo
                        </p>
                    </div>
                    <Badge variant="secondary" className="gap-2 px-4 py-2 bg-accent/50">
                        <Shield className="h-4 w-4" />
                        Panel Admin
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date().toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary/80 bg-lienar-to-r from-primary/5 to-transparent">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <Users className="h-8 w-8 text-primary" />
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {isLoading ? "..." : totalVets}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg">Veterinarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {activeVets} activos de {totalVets}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 bg-linear-to-r from-emerald-50 to-transparent dark:from-emerald-500/10">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <UserCheck className="h-8 w-8 text-emerald-600" />
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                                {isLoading ? "..." : totalDuenos}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg">Propietarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Clientes registrados
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 bg-linear-to-r from-orange-50 to-transparent dark:from-orange-500/10">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <PawPrint className="h-8 w-8 text-orange-600" />
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                                {isLoading ? "..." : totalMascotas}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg">Mascotas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Bajo cuidado
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 bg-linear-to-r from-blue-50 to-transparent dark:from-blue-500/10">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <Syringe className="h-8 w-8 text-blue-600" />
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                                {isLoading ? "..." : vacunasThisMonth}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg">Vacunas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Este mes ({totalVacunas} total)
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="group hover:shadow-lg transition-all duration-300 bg-linear-to-br from-card to-muted/20">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Personal Médico</CardTitle>
                                <CardDescription>
                                    Gestión del equipo veterinario
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-linear-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-3">
                                <Activity className="h-6 w-6 text-primary" />
                                <div>
                                    <div className="text-2xl font-bold text-primary">{activeVets}/{totalVets}</div>
                                    <div className="text-sm text-muted-foreground">Activos</div>
                                </div>
                            </div>
                            <TrendingUp className="h-8 w-8 text-primary/60" />
                        </div>
                        <Link href="/dashboard/admin/veterinarios">
                            <Button className="w-full group-hover:bg-primary/90 transition-colors">
                                Administrar Personal
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 bg-linear-to-br from-card to-orange-50/20 dark:to-orange-500/10">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors dark:bg-orange-500/20 dark:group-hover:bg-orange-500/30">
                                <Heart className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Centro Clínico</CardTitle>
                                <CardDescription>
                                    Panel operativo veterinario
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="p-3 bg-emerald-50 rounded-lg dark:bg-emerald-500/20">
                                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{totalDuenos}</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400">Propietarios</div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg dark:bg-orange-500/20">
                                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{totalMascotas}</div>
                                <div className="text-xs text-orange-600 dark:text-orange-400">Pacientes</div>
                            </div>
                        </div>
                        <Link href="/dashboard/veterinaria" target="_blank">
                            <Button variant="outline" className="w-full group-hover:bg-orange-50 transition-colors dark:group-hover:bg-orange-500/10">
                                Acceder al Panel
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-linear-to-r from-card to-accent/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Acceso Rápido
                    </CardTitle>
                    <CardDescription>
                        Operaciones frecuentes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/dashboard/admin/veterinarios" target="_blank">
                            <Button variant="outline" className="w-full h-16 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200">
                                <div className="flex items-center space-x-3">
                                    <Plus className="h-5 w-5 text-primary" />
                                    <div className="text-left">
                                        <div className="font-medium">Nuevo Veterinario</div>
                                        <div className="text-xs text-muted-foreground">Registrar</div>
                                    </div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/dashboard/veterinaria/duenos" target="_blank">
                            <Button variant="outline" className="w-full h-16 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 dark:hover:bg-emerald-500/10">
                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-emerald-600" />
                                    <div className="text-left">
                                        <div className="font-medium">Clientes</div>
                                        <div className="text-xs text-muted-foreground">{totalDuenos} registrados</div>
                                    </div>
                                </div>
                            </Button>
                        </Link>

                        <Link href="/dashboard/veterinaria/mascotas" target="_blank">
                            <Button variant="outline" className="w-full h-16 hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 dark:hover:bg-orange-500/10">
                                <div className="flex items-center space-x-3">
                                    <PawPrint className="h-5 w-5 text-orange-600" />
                                    <div className="text-left">
                                        <div className="font-medium">Mascotas</div>
                                        <div className="text-xs text-muted-foreground">{totalMascotas} pacientes</div>
                                    </div>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function AdminLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-96" />
                <Skeleton className="h-6 w-72" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function AdminPage() {
    return (
        <VetProvider>
            <DuenoProvider>
                <MascotaProvider>
                    <VacunaProvider>
                        <AdminDashboardContent />
                    </VacunaProvider>
                </MascotaProvider>
            </DuenoProvider>
        </VetProvider>
    );
}

export default AdminPage;
