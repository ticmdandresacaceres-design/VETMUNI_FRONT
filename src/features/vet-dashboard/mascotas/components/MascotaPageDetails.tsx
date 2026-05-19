"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMascota } from '../hooks/useMascotas';
import { useVacunasPorMascota } from '../../vacunas/hooks/useVacunas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, Phone, Mail, User, PawPrint, Camera, 
    Shield, Calendar, Plus, Syringe, Clock, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AddImagenModal from './AddImagenModal';
import GeneratePDFButton from './GeneratePDFButton';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDate } from "@/src/lib/utils/utils";

function MascotaPageDetails() {
    const router = useRouter();
    const { id } = useParams();
    const mascotaId = typeof id === 'string' ? id : '';
    
    const { data: mascota, isLoading: isMascotaLoading } = useMascota(mascotaId);
    const { data: vacunas, isLoading: isVacunasLoading } = useVacunasPorMascota(mascotaId);
    
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Nota: El tipo Mascota debería incluir images si vienen del backend
    // Por ahora usaremos un array vacío si no existe
    const imagenList = (mascota as any)?.images || [];

    const handleOpenAddImageModal = () => {
        setIsAddImageModalOpen(true);
    };

    const handleCloseAddImageModal = () => {
        setIsAddImageModalOpen(false);
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handleCloseImageViewer = () => {
        setSelectedImageIndex(null);
    };

    const handlePreviousImage = () => {
        if (selectedImageIndex !== null && imagenList.length > 0) {
            const newIndex = selectedImageIndex === 0 
                ? imagenList.length - 1 
                : selectedImageIndex - 1;
            setSelectedImageIndex(newIndex);
        }
    };

    const handleNextImage = () => {
        if (selectedImageIndex !== null && imagenList.length > 0) {
            const newIndex = selectedImageIndex === imagenList.length - 1 
                ? 0 
                : selectedImageIndex + 1;
            setSelectedImageIndex(newIndex);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            
            if (e.key === 'ArrowLeft') {
                handlePreviousImage();
            } else if (e.key === 'ArrowRight') {
                handleNextImage();
            } else if (e.key === 'Escape') {
                handleCloseImageViewer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, imagenList]);

    if (isMascotaLoading) {
        return <MascotaPageDetailsSkeleton />;
    }

    if (!mascota) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-64">
                        <PawPrint className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold">Mascota no encontrada</h3>
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
        species, 
        race, 
        years, 
        months,
        gender, 
        color, 
        id: identificador, 
        status: estado,
        user: dueno,
        created_at: createdAt,
    } = mascota;

    const currentImage = selectedImageIndex !== null ? imagenList[selectedImageIndex] : null;

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
                        <h1 className="text-2xl font-bold tracking-tight">Perfil de Mascota</h1>
                        <p className="text-sm text-muted-foreground">Detalles clínicos y administrativos</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <GeneratePDFButton 
                        mascotaData={mascota} 
                        variant="outline" 
                        size="sm" 
                    />
                    <Badge 
                        variant={estado === 'Activo' ? 'default' : 'secondary'}
                        className="px-3 py-1 text-sm"
                    >
                        {estado}
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: Profile & Owner (Sidebar) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Pet Profile Card */}
                    <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm">
                        <CardContent className="p-0">
                            <div className="bg-muted/30 p-6 flex flex-col items-center text-center border-b">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-md mb-4">
                                    <AvatarImage src={(mascota as any).image_url} alt={name} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <PawPrint className="w-12 h-12" />
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                                <div className="flex items-center gap-2 mt-2 text-sm font-medium text-muted-foreground">
                                    <Badge variant="secondary" className="rounded-full font-normal">
                                        {species}
                                    </Badge>
                                    <span>•</span>
                                    <span>{race}</span>
                                </div>
                            </div>
                            
                            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Edad</p>
                                    <p className="font-semibold">{years} años, {months} meses</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sexo</p>
                                    <p className="font-semibold">{gender}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</p>
                                    <p className="font-semibold">{color}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Sistema</p>
                                    <p className="font-mono text-xs bg-muted px-2 py-0.5 rounded-md inline-block truncate w-full">{identificador}</p>
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6 pt-0">
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                    <Calendar className="w-3 h-3" />
                                    <span>Registrado: {createdAt ? formatDate(createdAt) : 'N/A'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Owner Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="w-5 h-5 text-primary" />
                                Propietario
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {dueno ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                        <div className="bg-background p-2 rounded-full shadow-xs">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Nombre</p>
                                            <p className="font-medium text-sm">{dueno.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                        <div className="bg-background p-2 rounded-full shadow-xs">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Teléfono</p>
                                            <p className="font-medium text-sm">{dueno.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                                        <div className="bg-background p-2 rounded-full shadow-xs">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-muted-foreground">Correo</p>
                                            <p className="font-medium text-sm truncate" title={dueno.email}>{dueno.email}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Información del dueño no disponible</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Vaccines & Gallery */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Vaccines Section */}
                    <Card className="border-none shadow-md bg-card ring-1 ring-border">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-xl text-primary">
                                        <Shield className="w-6 h-6" />
                                        Plan de Vacunación
                                    </CardTitle>
                                    <CardDescription>
                                        Historial clínico de inmunización
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="h-8 px-3 text-sm gap-1 bg-background">
                                    <Syringe className="w-3.5 h-3.5" />
                                    {vacunas?.length || 0} Registradas
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isVacunasLoading ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                                </div>
                            ) : vacunas && vacunas.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {vacunas.map((vacunaItem) => (
                                        <div 
                                            key={vacunaItem.id} 
                                            className="group relative flex flex-col justify-between p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                        <Syringe className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-base leading-none mb-1">{vacunaItem.type}</h4>
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                                            Aplicada
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mt-2 pt-3 border-t border-dashed">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" /> Aplicación
                                                    </span>
                                                    <span className="font-medium">{formatDate(vacunaItem.aplication_date)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> Vencimiento
                                                    </span>
                                                    <span className="font-medium text-primary">{formatDate(vacunaItem.expiration_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                                    <div className="bg-muted p-4 rounded-full mb-4">
                                        <Shield className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">Sin vacunas registradas</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Esta mascota aún no tiene historial de vacunación en el sistema.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Gallery Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Camera className="w-5 h-5" />
                                    Galería Fotográfica
                                </CardTitle>
                                <Button 
                                    variant="outline"
                                    size="sm" 
                                    onClick={handleOpenAddImageModal}
                                    className="gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nueva Foto
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {imagenList.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {imagenList.map((imagen: any, index: number) => (
                                        <div 
                                            key={imagen.id} 
                                            className="group relative aspect-square rounded-xl overflow-hidden bg-muted border shadow-xs cursor-pointer"
                                            onClick={() => handleImageClick(index)}
                                        >
                                            <img 
                                                src={imagen.url} 
                                                alt={imagen.description || "Imagen de mascota"}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-medium px-2 text-center truncate w-full">
                                                    {imagen.description || "Sin descripción"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
                                    <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground mb-4">
                                        No hay imágenes en la galería
                                    </p>
                                    <Button 
                                        size="sm"
                                        onClick={handleOpenAddImageModal}
                                    >
                                        Subir primera imagen
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal para agregar imagen */}
            <AddImagenModal
                isOpen={isAddImageModalOpen}
                onClose={handleCloseAddImageModal}
                mascotaId={mascotaId}
                mascotaNombre={name}
            />

            {/* Image Viewer Modal - Simplified */}
            <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && handleCloseImageViewer()}>
                <DialogContent className="max-w-4xl p-0 gap-0">
                    <VisuallyHidden>
                        <DialogTitle>
                            {currentImage?.description || "Visor de imagen"}
                        </DialogTitle>
                    </VisuallyHidden>
                    
                    {currentImage && (
                        <div className="relative">
                            {/* Header */}
                            <div className="flex items-start justify-between p-4 border-b">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate">
                                        {currentImage.description || "Sin descripción"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Imagen {(selectedImageIndex ?? 0) + 1} de {imagenList.length}
                                    </p>
                                </div>
                             
                            </div>

                            {/* Image Container */}
                            <div className="relative bg-black/5 dark:bg-black/20">
                                <img
                                    src={currentImage.url}
                                    alt={currentImage.description || "Imagen de mascota"}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                />

                                {/* Navigation Buttons */}
                                {imagenList.length > 1 && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={handlePreviousImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Footer with keyboard hints */}
                            {imagenList.length > 1 && (
                                <div className="flex items-center justify-center gap-4 p-3 border-t bg-muted/30 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-2 py-1 bg-background rounded border text-[10px] font-mono">←</kbd>
                                        <kbd className="px-2 py-1 bg-background rounded border text-[10px] font-mono">→</kbd>
                                        <span>Navegar</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-2 py-1 bg-background rounded border text-[10px] font-mono">ESC</kbd>
                                        <span>Cerrar</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function MascotaPageDetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-9 w-24" />
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                            <Skeleton className="w-32 h-32 rounded-full mb-4" />
                            <Skeleton className="h-8 w-40 mb-2" />
                            <Skeleton className="h-5 w-24 mb-6" />
                            <div className="grid grid-cols-2 gap-6 w-full">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-3 w-12" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-lg" />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-7 w-24" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="aspect-square rounded-xl" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default MascotaPageDetails;