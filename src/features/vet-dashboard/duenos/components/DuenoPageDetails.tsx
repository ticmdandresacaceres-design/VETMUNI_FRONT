'use client'

import { useParams, useRouter } from 'next/navigation';
import { useDueno } from '../hooks/useDuenos';
import { useMascotas } from '../../mascotas/hooks/useMascotas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft, Phone, Mail, User, PawPrint, MapPin, 
    Gauge, Navigation, Building, IdCard 
} from 'lucide-react';
import DuenoPageDetailsSkeleton from './DuenoPageDetailsSkeleton';
import DuenoLocationMap from './DuenoLocationMap';

function DuenoPageDetails() {
    const router = useRouter();
    const { id } = useParams();
    const duenoId = typeof id === 'string' ? id : '';
    
    const { data: dueno, isLoading: isDuenoLoading } = useDueno(duenoId);
    const { data: allMascotas, isLoading: isMascotasLoading } = useMascotas();

    const loading = isDuenoLoading || isMascotasLoading;

    if (loading) {
        return <DuenoPageDetailsSkeleton />;
    }

    if (!dueno) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-64">
                        <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold">Propietario no encontrado</h3>
                        <p className="text-muted-foreground mb-6">No se encontraron datos para el identificador proporcionado.</p>
                        <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al listado
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { 
        name, 
        dni, 
        address, 
        phone, 
        email, 
        longitude, 
        latitude,
    } = dueno;

    const myMascotas = allMascotas?.filter(m => m.user_id === duenoId) || [];

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6 animate-in fade-in duration-500">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-muted"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Perfil del Propietario</h1>
                        <p className="text-sm text-muted-foreground">Información de contacto y ubicación</p>
                    </div>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-sm gap-2">
                    <IdCard className="w-3.5 h-3.5" />
                    DNI: {dni}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: Personal Info & Stats (Sidebar) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Profile Card */}
                    <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm">
                        <CardContent className="p-0">
                            <div className="bg-muted/30 p-6 flex flex-col items-center text-center border-b">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-md mb-4">
                                    <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                                        {name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">Dueño Registrado</p>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                    <div className="bg-background p-2 rounded-full shadow-xs">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-muted-foreground">Teléfono</p>
                                        <p className="font-medium text-sm truncate">{phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                    <div className="bg-background p-2 rounded-full shadow-xs">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                                        <p className="font-medium text-sm truncate" title={email}>{email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                    <div className="bg-background p-2 rounded-full shadow-xs">
                                        <Building className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-muted-foreground">Dirección</p>
                                        <p className="font-medium text-sm truncate" title={address}>{address}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Gauge className="w-5 h-5 text-primary" />
                                Resumen de Mascotas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <span className="text-sm font-medium">Total Registradas</span>
                                <Badge className="text-base px-3 py-1">{myMascotas.length}</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                <div className="p-3 rounded-lg bg-muted/40 border text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Perros</p>
                                    <p className="font-bold text-xl text-primary">
                                        {myMascotas.filter(pet => pet.species.toLowerCase() === 'perro').length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Gatos</p>
                                    <p className="font-bold text-xl text-primary">
                                        {myMascotas.filter(pet => pet.species.toLowerCase() === 'gato').length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Otros</p>
                                    <p className="font-bold text-xl text-primary">
                                        {myMascotas.filter(pet => 
                                            !['perro', 'gato'].includes(pet.species.toLowerCase())
                                        ).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Map & Pets (Main Content) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Location Map Section - THE FOCUS */}
                    <Card className="border-none shadow-md bg-card ring-1 ring-border overflow-hidden">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-xl text-primary">
                                        <MapPin className="w-6 h-6" />
                                        Ubicación Domiciliaria
                                    </CardTitle>
                                    <CardDescription>
                                        Geolocalización registrada para visitas a domicilio
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-2 rounded-full border">
                                    <Navigation className="w-3.5 h-3.5" />
                                    <span className="font-mono">{latitude ? Number(latitude).toFixed(4) : '0.0000'}, {longitude ? Number(longitude).toFixed(4) : '0.0000'}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DuenoLocationMap
                                latitud={latitude ? Number(latitude) : 0}
                                longitud={longitude ? Number(longitude) : 0}
                                nombre={name}
                                direccion={address}
                                className="h-[400px] w-full"
                            />
                            <div className="p-4 bg-muted/10 border-t">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Dirección Completa</p>
                                        <p className="text-sm font-medium text-foreground">{address}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pets List Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <PawPrint className="w-5 h-5 text-primary" />
                                Mascotas Asociadas
                            </CardTitle>
                            <CardDescription>
                                Listado completo de animales registrados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {myMascotas.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {myMascotas.map((pet) => (
                                        <div 
                                            key={pet.id} 
                                            className="group flex items-start gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200"
                                        >
                                            <Avatar className="w-16 h-16 border-2 border-muted group-hover:border-primary transition-colors">
                                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                    <PawPrint className="w-7 h-7 opacity-50" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-semibold text-base truncate">{pet.name}</h4>
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-2 capitalize shrink-0">
                                                        {pet.species}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {pet.race}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                        <span className={`w-2 h-2 rounded-full ${pet.gender === 'MACHO' ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                                                        {pet.gender}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                                    <div className="bg-muted p-4 rounded-full mb-4">
                                        <PawPrint className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">Sin mascotas registradas</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Este propietario aún no tiene mascotas asociadas en el sistema.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DuenoPageDetails;