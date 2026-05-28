"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCombinedPetWithOwner } from "../hooks/usePacientes";
import { getVaccineStatus } from "../hooks/usePacientes";
import { useVacunasPorMascota, useCreateVacuna } from "../../vaccines/hooks/useVacunas";
import { useDeleteMascota, useUploadPetImage, useDeletePetImage } from "../hooks/useMascotas";
import VaccineTimeline from "./VaccineTimeline";
import type { VaccineStatus } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  PawPrint,
  Phone,
  Calendar,
  Syringe,
  User,
  Hash,
  Heart,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FlaskConical,
  Plus,
  ExternalLink,
  Camera,
  FileImage,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import EditMascotaModal from "./EditMascotaModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateMascotaPDF } from "@/src/lib/utils/dim-generador";
import { resolveImageUrl } from "@/src/lib/utils/utils";

const vacunasPerro = [
  "Rabia", "Séxtuple", "Quíntuple", "Moquillo", "Parvovirus",
  "Leptospirosis", "Bordetella (Tos de las perreras)", "Giardia",
  "Coronavirus", "Hepatitis Infecciosa", "Triple Canina", "Polivalente", "Otra",
];

const vacunasGato = [
  "Rabia", "Triple Felina (Viral)", "Cuádruple Felina",
  "Leucemia Felina (FeLV)", "Panleucopenia", "Calicivirus",
  "Rinotraqueítis", "Clamidiasis", "Peritonitis Infecciosa (PIF)",
  "Inmunodeficiencia Felina (FIV)", "Otra",
];

const vaccineStatusConfig: Record<VaccineStatus, { label: string; icon: React.ComponentType<{ className?: string }>; class: string }> = {
  al_dia: { label: "Al día", icon: CheckCircle2, class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  proxima: { label: "Próxima a vencer", icon: Clock, class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  vencida: { label: "Vencida", icon: XCircle, class: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" },
  sin_vacunas: { label: "Sin vacunas", icon: AlertTriangle, class: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800" },
};

interface PacienteDetailProps {
  petId: string;
}

export default function PacienteDetail({ petId }: PacienteDetailProps) {
  const router = useRouter();
  const { mascota, dueno, vacunas, vaccineInfo, isLoading } = useCombinedPetWithOwner(petId);
  const createVacuna = useCreateVacuna();
  const deleteMascota = useDeleteMascota();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [vaccineType, setVaccineType] = useState("");
  const [vaccineDate, setVaccineDate] = useState(new Date().toISOString().split("T")[0]);
  const [vaccineMonths, setVaccineMonths] = useState("12");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadImage = useUploadPetImage();
  const deleteImage = useDeletePetImage(petId);

  const petImage = resolveImageUrl(mascota?.images?.[0]?.path_url);
  const petImageId = mascota?.images?.[0]?.id;

  const resetImageSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadImage.mutateAsync({ petId, image: selectedFile });
      toast.success("Imagen subida correctamente");
      setShowImageDialog(false);
      resetImageSelection();
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!petImageId) return;
    try {
      await deleteImage.mutateAsync(petImageId);
      toast.success("Imagen eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la imagen");
    }
  };

  const handleGenerateDIM = async () => {
    if (!mascota) return;
    try {
      await generateMascotaPDF(mascota);
      toast.success("DIM generado correctamente");
    } catch {
      toast.error("Error al generar el DIM");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-[420px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!mascota) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <PawPrint className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">Paciente no encontrado</h3>
          <p className="text-muted-foreground text-sm mb-6">No se encontraron datos para este paciente.</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  const VaxIcon = vaccineStatusConfig[vaccineInfo.status]?.icon ?? CheckCircle2;

  const handleAddVaccine = async () => {
    if (!vaccineType.trim()) {
      toast.error("Indica el tipo de vacuna");
      return;
    }
    try {
      await createVacuna.mutateAsync({
        type: vaccineType,
        aplication_date: vaccineDate,
        months_validity: parseInt(vaccineMonths) || 6,
        pet_id: petId,
      });
      setShowAddVaccine(false);
      setVaccineType("");
      toast.success("Vacuna registrada correctamente");
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await deleteMascota.mutateAsync(petId);
      toast.success("Paciente eliminado");
      router.push("/dashboard/pacientes");
    } catch {}
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{mascota.name}</h1>
              <Badge variant={mascota.status === "ADOPTADO" ? "default" : "secondary"} className="text-[10px] h-5">
                {mascota.status === "ADOPTADO" ? "Adoptado" : "En Adopción"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {mascota.species} · {mascota.race} · {mascota.age}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleGenerateDIM}>
            <FileImage className="w-4 h-4" />
            DIM
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowAddVaccine(true)}>
            <Syringe className="w-4 h-4" />
            Vacunar
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowEditModal(true)}>
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column - Patient Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col items-center text-center border-b relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative mb-4">
                  <Avatar className="w-28 h-28 border-4 border-background shadow-md">
                    {petImage ? (
                      <AvatarImage src={petImage} alt={mascota.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                      {mascota.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 shadow-md"
                    onClick={() => { resetImageSelection(); setShowImageDialog(true); }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  {petImageId && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 rounded-full w-7 h-7 shadow-md"
                      onClick={handleDeleteImage}
                      disabled={deleteImage.isPending}
                    >
                      {deleteImage.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                    </Button>
                  )}
                </div>
                <h2 className="text-xl font-bold">{mascota.name}</h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge variant="outline" className="capitalize text-xs">{mascota.species}</Badge>
                  <Badge variant="outline" className="text-xs">{mascota.gender}</Badge>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-sm font-medium ${vaccineStatusConfig[vaccineInfo.status]?.class}`}>
                  <VaxIcon className="w-4 h-4" />
                  {vaccineStatusConfig[vaccineInfo.status]?.label}
                </div>

                <div className="space-y-2 mt-4">
                  <InfoRow icon={User} label="Especie" value={mascota.species} />
                  <InfoRow icon={Hash} label="Raza" value={mascota.race} />
                  <InfoRow icon={Heart} label="Género" value={mascota.gender} />
                  <InfoRow icon={FlaskConical} label="Color" value={mascota.color} />
                  <InfoRow icon={PawPrint} label="Temperamento" value={mascota.temperament} />
                  <InfoRow icon={Calendar} label="Edad" value={mascota.age} />
                  <InfoRow icon={User} label="Cond. Reproductiva" value={mascota.reproductive_condition} />
                </div>

                {dueno && (
                  <div
                    onClick={() => router.push(`/dashboard/duenos/${dueno.id}`)}
                    className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                          {dueno.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{dueno.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {dueno.phone ?? "Sin teléfono"}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Vaccine History */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardContent className="p-5">
              <VaccineTimeline
                vacunas={vacunas}
                onAddVaccine={() => setShowAddVaccine(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Vaccine Dialog */}
      <Dialog open={showAddVaccine} onOpenChange={setShowAddVaccine}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5 text-primary" />
              Registrar Vacuna
            </DialogTitle>
            <DialogDescription>
              Para {mascota.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tipo de vacuna</Label>
              <Select value={vaccineType} onValueChange={setVaccineType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vacuna..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Perros</div>
                  {vacunasPerro.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Gatos</div>
                  {vacunasGato.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha de aplicación</Label>
              <Input type="date" value={vaccineDate} onChange={(e) => setVaccineDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Validez (meses)</Label>
              <Input type="number" value={vaccineMonths} onChange={(e) => setVaccineMonths(e.target.value)} placeholder="12" min={1} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddVaccine(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddVaccine} disabled={createVacuna.isPending} className="gap-2">
              <Plus className="w-4 h-4" />
              {createVacuna.isPending ? "Registrando..." : "Registrar Vacuna"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mascota Modal */}
      {mascota && (
        <EditMascotaModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          mascota={mascota}
        />
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar paciente</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar a {mascota.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMascota.isPending}>
              {deleteMascota.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              {petImage ? "Cambiar foto de mascota" : "Subir foto de mascota"}
            </DialogTitle>
            <DialogDescription>
               Selecciona una imagen para {mascota.name}. Formatos: JPG, PNG, WebP. Máx 5MB.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {previewUrl ? (
              <div className="relative w-full max-w-[250px] aspect-square rounded-xl overflow-hidden border">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full"
                  onClick={resetImageSelection}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-[250px] aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
              >
                <Upload className="w-10 h-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Haz clic para seleccionar</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleSelectFile}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUploadImage} disabled={!selectedFile || uploading} className="gap-2">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Subiendo..." : "Subir imagen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
      <div className="bg-background p-1.5 rounded-full shadow-sm">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium capitalize">{value?.toLowerCase() ?? "—"}</span>
      </div>
    </div>
  );
}
