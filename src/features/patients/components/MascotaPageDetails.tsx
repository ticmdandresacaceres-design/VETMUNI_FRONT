"use client"

import { useParams, useRouter } from "next/navigation"
import { useMascota } from "../hooks/useMascotas"
import { useVacunasPorMascota } from "../../vaccines/hooks/useVacunas"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  PawPrint,
  Calendar,
  Clock,
  Syringe,
  User,
  Hash,
  Heart,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

function MascotaPageDetails() {
  const router = useRouter()
  const { id } = useParams()
  const mascotaId = typeof id === "string" ? id : ""

  const { data: mascota, isLoading: isMascotaLoading } = useMascota(mascotaId)
  const { data: vacunas, isLoading: isVacunasLoading } = useVacunasPorMascota(mascotaId)

  const loading = isMascotaLoading || isVacunasLoading

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!mascota) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <PawPrint className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">Mascota no encontrada</h3>
            <p className="text-muted-foreground mb-6">No se encontraron datos para el identificador proporcionado.</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al listado
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { name, species, race, gender, temperament, reproductive_condition, color, age, status, user } = mascota

  const getVacunaStatus = (expirationDate: string) => {
    const now = new Date()
    const exp = new Date(expirationDate)
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: "Vencida", variant: "destructive" as const }
    if (diffDays <= 30) return { label: "Próxima a vencer", variant: "warning" as const }
    return { label: "Vigente", variant: "default" as const }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Perfil de la Mascota</h1>
            <p className="text-sm text-muted-foreground">Información completa y historial de vacunas</p>
          </div>
        </div>
        <Badge variant={status === "ADOPTADO" ? "default" : "secondary"} className="px-3 py-1 text-sm">
          {status === "ADOPTADO" ? "Adoptado" : "En Adopción"}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm">
            <CardContent className="p-0">
              <div className="bg-muted/30 p-6 flex flex-col items-center text-center border-b">
                <Avatar className="w-32 h-32 border-4 border-background shadow-md mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{species} - {race}</p>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="bg-background p-2 rounded-full shadow-sm">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Color</p>
                    <p className="font-medium text-sm">{color}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="bg-background p-2 rounded-full shadow-sm">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Género</p>
                    <p className="font-medium text-sm">{gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="bg-background p-2 rounded-full shadow-sm">
                    <PawPrint className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Temperamento</p>
                    <p className="font-medium text-sm">{temperament}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="bg-background p-2 rounded-full shadow-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Condición Reproductiva</p>
                    <p className="font-medium text-sm">{reproductive_condition}</p>
                  </div>
                </div>
                {user && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                    <div className="bg-background p-2 rounded-full shadow-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dueño</p>
                      <p className="font-medium text-sm">{user.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Edad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{age}</p>
                  <p className="text-xs text-muted-foreground">Edad</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Syringe className="w-5 h-5 text-primary" />
                Historial de Vacunas
              </CardTitle>
              <CardDescription>
                Registro de vacunas aplicadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vacunas && vacunas.length > 0 ? (
                <div className="space-y-3">
                  {vacunas.map((vacuna) => {
                    const vacunaStatus = getVacunaStatus(vacuna.expiration_date)
                    return (
                      <div
                        key={vacuna.id}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Syringe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{vacuna.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              Aplicada: {vacuna.aplication_date.split("T")[0].split("-").reverse().join("/")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={vacunaStatus.variant === "warning" ? "secondary" : vacunaStatus.variant} className="mb-1">
                            {vacunaStatus.label}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Vence: {vacuna.expiration_date.split("T")[0].split("-").reverse().join("/")}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/10">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <Syringe className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Sin vacunas registradas</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Esta mascota aún no tiene vacunas registradas en el sistema.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MascotaPageDetails
