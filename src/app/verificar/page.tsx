"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/src/lib/api/axios";
import { resolveImageUrl, formatDate } from "@/src/lib/utils/utils";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar, AvatarImage, AvatarFallback
} from "@/components/ui/avatar";
import {
  Shield, Clock, Phone, MapPin, FileText, AlertTriangle, XCircle, User, Calendar, Syringe, PawPrint, Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateVerificarPDF } from "@/src/lib/utils/verificar-pdf";

interface VerifyVaccine {
  id: string;
  type: string;
  aplication_date: string;
  months_validity: number;
  expiration_date: string;
  next_vaccine_date: string;
}

interface VerifyOwner {
  id: string;
  name: string;
  phone: string;
  address: string;
  dni: string;
}

interface VerifyImage {
  id: string;
  path_url: string;
}

interface VerifyResponse {
  id: string;
  identifier: string;
  name: string;
  species: string;
  race: string;
  gender: string;
  color: string;
  temperament: string;
  reproductive_condition: string;
  age: string;
  status: string;
  owner: VerifyOwner;
  images: VerifyImage[];
  vaccines: VerifyVaccine[];
}

interface VerifyResponseWrapper {
  data: VerifyResponse;
}

const vaccineTypeLabels: Record<string, string> = {
  "rabia": "Antirrábica",
  "parvovirus": "Parvovirus",
  "moquillo": "Moquillo",
  "polivalente": "Polivalente",
  "leptospirosis": "Leptospirosis",
  "bordetella": "Bordetella",
  "influenza": "Influenza Canina",
  "desparasitacion": "Desparasitación",
};

const speciesEmoji: Record<string, string> = {
  "perro": "🐕",
  "gato": "🐈",
  "ave": "🐦",
  "conejo": "🐇",
  "hamster": "🐹",
  "tortuga": "🐢",
};

const genderLabel: Record<string, string> = {
  "macho": "Macho",
  "hembra": "Hembra",
};

function getVaccineBadgeVariant(v: VerifyVaccine): "destructive" | "secondary" | "default" | "outline" {
  if (!v.expiration_date) return "secondary";
  const today = new Date();
  const exp = new Date(v.expiration_date);
  if (exp < today) return "destructive";
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return "outline";
  return "default";
}

function getVaccineBadgeLabel(v: VerifyVaccine): string {
  if (!v.expiration_date) return "Sin caducidad";
  const today = new Date();
  const exp = new Date(v.expiration_date);
  if (exp < today) return "Vencida";
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return `Vence en ${diffDays} días`;
  return "Vigente";
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status?.toLowerCase();
  if (s === "activo" || s === "adoptado") return "default";
  if (s === "inactivo") return "secondary";
  if (s === "fallecido") return "destructive";
  return "outline";
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!data) return;
    setPdfLoading(true);
    try {
      await generateVerificarPDF(data);
    } catch {
      setError("Error al generar el PDF. Intente nuevamente.");
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    apiClient.get<VerifyResponseWrapper>(`/verify/${id}`)
      .then((res) => { if (!cancelled) setData(res.data.data); })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) {
          setError("No se encontró ninguna mascota con este código.");
        } else {
          setError("Error al consultar la información. Intente nuevamente.");
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-6 pb-6">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-7 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Código no especificado</h2>
            <p className="text-sm text-muted-foreground mb-4">No se especificó un código de mascota.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-4">
          <div className="text-center space-y-2 mb-6">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-6 pb-6">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-7 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Mascota no encontrada</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <p className="text-xs text-muted-foreground/60 font-mono">Código: {id}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const photoUrl = resolveImageUrl(data.images?.[0]?.path_url);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="inline-flex gap-1.5 px-3 py-1">
              <Shield className="size-3.5" />
              Registro Oficial Municipal
            </Badge>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Documento de Identidad de Mascota
            </h1>
            <p className="text-sm text-muted-foreground">
              M. D. Andrés Avelino Cáceres Dorregaray
            </p>
          </div>
          <Button
            onClick={handleExportPDF}
            disabled={pdfLoading}
            variant="default"
            size="default"
            className="shrink-0 gap-2"
          >
            <Printer className="size-4" />
            {pdfLoading ? "Generando PDF..." : "Exportar PDF"}
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 md:size-14 rounded-lg border">
                {photoUrl ? (
                  <AvatarImage src={photoUrl} alt={data.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="rounded-lg text-2xl">
                    {speciesEmoji[data.species?.toLowerCase()] || <PawPrint className="size-5" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-lg md:text-xl">{data.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {speciesEmoji[data.species?.toLowerCase()] || ""} {data.species} · {genderLabel[data.gender?.toLowerCase()] || data.gender}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Código</p>
              <p className="text-sm md:text-base font-semibold font-mono tracking-widest text-primary">
                {data.identifier}
              </p>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant={getStatusBadgeVariant(data.status)}>
                {data.status}
              </Badge>
              <Badge variant="outline">
                {data.reproductive_condition || "No especificado"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Raza", value: data.race || "—" },
                { label: "Color", value: data.color || "—" },
                { label: "Edad", value: data.age },
                { label: "Temperamento", value: data.temperament?.toLowerCase() || "—" },
              ].map((item) => (
                <div key={item.label} className="bg-muted/50 rounded-lg px-3.5 py-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>

          <Separator />

          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Propietario
              </h3>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{data.owner?.name || "No registrado"}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
                {data.owner?.dni && (
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    DNI: {data.owner.dni}
                  </span>
                )}
                {data.owner?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    {data.owner.phone}
                  </span>
                )}
                {data.owner?.address && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {data.owner.address}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Syringe className="size-4 text-primary" />
              Vacunas
            </CardTitle>
          </CardHeader>
          <Separator />
          {data.vaccines?.length > 0 ? (
            <CardContent className="pt-6 space-y-3">
              {data.vaccines.map((v) => (
                <div key={v.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {vaccineTypeLabels[v.type?.toLowerCase()] || v.type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatDate(v.aplication_date)}
                    </p>
                  </div>
                  <Badge variant={getVaccineBadgeVariant(v)} className="shrink-0">
                    <Clock className="size-3" />
                    {getVaccineBadgeLabel(v)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          ) : (
            <CardContent className="pt-6 pb-6 text-center">
              <AlertTriangle className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sin vacunas registradas</p>
            </CardContent>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground/40">
          M. D. Andrés Avelino Cáceres Dorregaray · Registro de Mascotas Municipal · {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}

function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

export default VerifyPage;
