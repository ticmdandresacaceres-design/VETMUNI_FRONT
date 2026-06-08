"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Users,
    ArrowRight,
    PawPrint,
    Shield,
    Syringe,
    Clock,
    MoreHorizontal,
    Edit,
    Trash2,
    UserPlus,
} from "lucide-react";
import { useVeterinarios, useDeleteVeterinario, useUpdateVeterinario } from "@/src/features/admin/hooks/useVet";
import { useDashboardStats } from "@/src/features/dashboard/hooks/useStats";
import { useAuthContext } from "@/src/features/auth/context/AuthContext";
import type { Veterinario } from "@/src/features/admin/types";

export default function AdminDashboardContent() {
    const { user } = useAuthContext();
    const { data: veterinarians, isLoading: vetsLoading } = useVeterinarios();
    const { data: stats, isLoading: statsLoading } = useDashboardStats();

    const veterinariansList = veterinarians ?? [];

    const deleteVetMutation = useDeleteVeterinario();
    const updateVetMutation = useUpdateVeterinario();

    const [vetToDelete, setVetToDelete] = useState<Veterinario | null>(null);
    const [vetToEdit, setVetToEdit] = useState<Veterinario | null>(null);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");

    const totalVets = veterinariansList.length;
    const activeVets = veterinariansList.filter(vet => vet.active).length;
    const totalDuenos = stats?.total_owners ?? 0;
    const totalMascotas = stats?.total_pets ?? 0;
    const vacunasThisMonth = stats?.vaccinated_this_month ?? 0;

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Buenos días" : currentHour < 18 ? "Buenas tardes" : "Buenas noches";

    const isLoading = vetsLoading || statsLoading;

    const handleDeleteConfirm = async () => {
        if (vetToDelete) {
            await deleteVetMutation.mutateAsync(vetToDelete.id);
            setVetToDelete(null);
        }
    };

    const handleEditSave = async () => {
        if (!vetToEdit) return;
        await updateVetMutation.mutateAsync({
            id: vetToEdit.id,
            data: { name: editName, phone: editPhone, address: editAddress },
        });
        setVetToEdit(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            {greeting}, {user?.name || "Admin"}
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">
                            Tu clínica veterinaria en un vistazo
                        </p>
                    </div>
                    <Badge variant="secondary" className="gap-2 px-4 py-2">
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

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
                <Card className="bg-primary/10 text-primary border-primary/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <Badge variant="secondary">{isLoading ? "..." : totalVets}</Badge>
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

                <Card className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <Badge variant="secondary">{isLoading ? "..." : totalDuenos}</Badge>
                        </div>
                        <CardTitle className="text-lg">Dueños</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Dueño registrados
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <PawPrint className="h-5 w-5 text-primary" />
                            </div>
                            <Badge variant="secondary">{isLoading ? "..." : totalMascotas}</Badge>
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

                <Card className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Syringe className="h-5 w-5 text-primary" />
                            </div>
                            <Badge variant="secondary">{isLoading ? "..." : vacunasThisMonth}</Badge>
                        </div>
                        <CardTitle className="text-lg">Vacunas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Vacunas aplicadas este mes
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Veterinarios Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Personal Médico
                            </CardTitle>
                            <CardDescription>
                                Gestión del equipo veterinario
                            </CardDescription>
                        </div>
                        <Link href="/dashboard/veterinarios">
                            <Button size="sm">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Nuevo
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-[70px]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vetsLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : veterinariansList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        No hay veterinarios registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                veterinariansList.map((vet) => (
                                    <TableRow key={vet.id}>
                                        <TableCell className="font-medium">{vet.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{vet.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={vet.active ? "default" : "secondary"}>
                                                {vet.active ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditName(vet.name);
                                                        setEditPhone(vet.phone);
                                                        setEditAddress(vet.address);
                                                        setVetToEdit(vet);
                                                    }}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => setVetToDelete(vet)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <p>
                            {veterinariansList.length} veterinario{veterinariansList.length !== 1 ? "s" : ""} registrado{veterinariansList.length !== 1 ? "s" : ""}
                        </p>
                        <Link href="/dashboard/veterinarios">
                            <Button variant="ghost" size="sm">
                                Ver todos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Access */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/veterinarios">
                    <Card className="group hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">Veterinarios</p>
                                        <p className="text-sm text-muted-foreground">Gestionar personal</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/duenos">
                    <Card className="group hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">Dueños</p>
                                        <p className="text-sm text-muted-foreground">{totalDuenos} registrados</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/pacientes">
                    <Card className="group hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <PawPrint className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">Mascotas</p>
                                        <p className="text-sm text-muted-foreground">{totalMascotas} pacientes</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={!!vetToDelete} onOpenChange={() => setVetToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar veterinario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente a <strong>{vetToDelete?.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteVetMutation.isPending}
                        >
                            {deleteVetMutation.isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <Dialog open={!!vetToEdit} onOpenChange={() => setVetToEdit(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Veterinario</DialogTitle>
                        <DialogDescription>
                            Modifica la información de {vetToEdit?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nombre</Label>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Nombre completo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                placeholder="999 888 777"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Dirección</Label>
                            <Input
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                placeholder="Av. Ejemplo 123"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setVetToEdit(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            disabled={updateVetMutation.isPending || !editName}
                        >
                            {updateVetMutation.isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


