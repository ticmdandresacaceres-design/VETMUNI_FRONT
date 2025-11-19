'use client'

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMascotaContext } from '../context/MascotaContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, User, PawPrint, Camera, Shield, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function MascotaPageDetails() {
    const router = useRouter();
    const { id } = useParams();
    const { mascotaPage, loading, getMascotaPage } = useMascotaContext();

    useEffect(() => {
        if (id && typeof id === 'string') {
            getMascotaPage(id);
        }
    }, [id, getMascotaPage]);

    if (loading) {
        return <MascotaPageDetailsSkeleton />;
    }

    if (!mascotaPage) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-48">
                        <PawPrint className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No se encontraron datos de la mascota</p>
                        <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                            className="mt-4"
                        >
                            Volver
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { 
        nombre, 
        especie, 
        raza, 
        edad, 
        sexo, 
        color, 
        identificador, 
        fotoUrl, 
        estado,
        imagenList,
        dueno,
        vacuna,
        fechaCreacion
    } = mascotaPage;

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            {/* Header con botón de regreso */}
            <div className="flex items-center gap-4 mb-6">
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{nombre}</h1>
                    <p className="text-muted-foreground">{especie} • {raza}</p>
                </div>
                <div className="ml-auto">
                    <Badge variant={estado === 'ACTIVO' ? 'default' : 'secondary'}>
                        {estado}
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Columna principal - Información de la mascota */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Card principal con imagen e info básica */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage 
                                            src={fotoUrl} 
                                            alt={nombre}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>
                                            <PawPrint className="w-8 h-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Edad</p>
                                        <p className="font-medium">{edad}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Sexo</p>
                                        <p className="font-medium">{sexo}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Color</p>
                                        <p className="font-medium">{color}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">ID</p>
                                        <p className="font-mono text-sm font-medium">{identificador}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del dueño */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="w-4 h-4" />
                                Información del Dueño
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-medium">{dueno.nombre}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{dueno.telefono}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{dueno.correo}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Galería de imágenes - Compacta */}
                    {imagenList.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Camera className="w-4 h-4" />
                                    Imágenes ({imagenList.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 gap-2">
                                    {imagenList.slice(0, 8).map((imagen) => (
                                        <div key={imagen.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                                            <img 
                                                src={imagen.url} 
                                                alt={imagen.descripcion}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {imagenList.length > 8 && (
                                    <p className="text-sm text-muted-foreground mt-2 text-center">
                                        +{imagenList.length - 8} imágenes más
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Vacunas e info adicional */}
                <div className="space-y-6">
                    {/* Historial de vacunas */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Shield className="w-4 h-4" />
                                Vacunas ({vacuna.totalVacunas})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {vacuna.vacunaslist.length > 0 ? (
                                <div className="space-y-3">
                                    {vacuna.vacunaslist.map((vacunaItem) => (
                                        <div key={vacunaItem.id} className="p-3 border rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{vacunaItem.tipo}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {vacunaItem.fechaAplicacion}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Vence</p>
                                                    <p className="text-xs font-medium">{vacunaItem.fechaVencimiento}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Sin vacunas registradas</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información adicional */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Registrado el {fechaCreacion}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function MascotaPageDetailsSkeleton() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-10 h-10" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="ml-auto h-6 w-16" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main card skeleton */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Owner info skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Vaccines skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default MascotaPageDetails;