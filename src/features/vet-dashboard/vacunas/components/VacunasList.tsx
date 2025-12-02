"use client"

import { useEffect, useState } from "react"
import { Eye, Syringe, Plus, Calendar, Clock, AlertTriangle, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useVacunaContext } from "../context/VacunaContext"
import AddVacunaModal from "./AddVacunaModal"
import VacunaFilters from "./VacunaFilters"
import { formatDate } from "@/src/lib/utils/utils"

export default function VacunasList() {
  const { vacunas, loading, getVacunas } = useVacunaContext()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      getVacunas()
    }
  }, [getVacunas, isMounted])

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  // Función para calcular días hasta una fecha
  const calcularDiasHasta = (fechaString: string): number => {
    const [year, month, day] = fechaString.split('-').map(Number)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaObjetivo = new Date(year, month - 1, day)
    const diferencia = fechaObjetivo.getTime() - hoy.getTime()
    return Math.ceil(diferencia / (1000 * 3600 * 24))
  }

  // Función para obtener el estado de vencimiento
  const getEstadoVencimiento = (fechaVencimiento: string) => {
    const dias = calcularDiasHasta(fechaVencimiento)
    
    if (dias < 0) {
      return { 
        variant: "destructive" as const, 
        icon: AlertTriangle, 
        text: "Vencida",
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0"
      }
    } else if (dias <= 30) {
      return { 
        variant: "secondary" as const, 
        icon: Clock, 
        text: "Por vencer",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0"
      }
    } else {
      return { 
        variant: "default" as const, 
        icon: CheckCircle, 
        text: "Vigente",
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0"
      }
    }
  }

  // Función para obtener el estado de próxima dosis
  const getEstadoProximaDosis = (fechaProximaDosis: string) => {
    const dias = calcularDiasHasta(fechaProximaDosis)
    
    if (dias < 0) {
      return { 
        variant: "destructive" as const, 
        icon: AlertTriangle, 
        text: "Atrasada",
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0"
      }
    } else if (dias <= 7) {
      return { 
        variant: "secondary" as const, 
        icon: Calendar, 
        text: "Próxima",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-0"
      }
    } else {
      return { 
        variant: "outline" as const, 
        icon: Calendar, 
        text: "Programada",
        className: "border-0"
      }
    }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
          <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-6 w-[90px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  if (!isMounted) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Tipo</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Fecha Aplicación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Próxima Dosis</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <LoadingSkeleton />
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const validVacunas = Array.isArray(vacunas) ? vacunas.filter(vacuna => vacuna && vacuna.id) : []
  
  // Calcular estadísticas
  const vigentes = validVacunas.filter(v => calcularDiasHasta(v.fechavencimiento) > 30).length
  const porVencer = validVacunas.filter(v => {
    const dias = calcularDiasHasta(v.fechavencimiento)
    return dias <= 30 && dias >= 0
  }).length
  const vencidas = validVacunas.filter(v => calcularDiasHasta(v.fechavencimiento) < 0).length

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="pb-4 space-y-4">
            {/* Título y botón - Primera fila */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Syringe className="h-5 w-5 text-primary" />
                  </div>
                  Gestión de Vacunas
                </CardTitle>
                <CardDescription className="text-sm">
                  Administra el registro y seguimiento de vacunas aplicadas a las mascotas
                </CardDescription>
              </div>
              
              <Button onClick={handleAddClick} size="default" className="gap-2 shadow-sm lg:shrink-0">
                <Plus className="h-4 w-4" />
                Registrar Vacuna
              </Button>
            </div>

            {/* Filtros - Segunda fila */}
            <div className="w-full pt-2">
              <VacunaFilters />
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Syringe className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Mostrando</p>
                  <p className="text-xl font-bold">{validVacunas.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-green-500/10 rounded-lg shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vigentes</p>
                  <p className="text-xl font-bold">{vigentes}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg shrink-0">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Por Vencer</p>
                  <p className="text-xl font-bold">{porVencer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-red-500/10 rounded-lg shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vencidas</p>
                  <p className="text-xl font-bold">{vencidas}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold w-[180px]">Tipo de Vacuna</TableHead>
                      <TableHead className="font-semibold w-[140px]">Mascota</TableHead>
                      <TableHead className="font-semibold w-[120px]">Fecha Aplicación</TableHead>
                      <TableHead className="font-semibold w-[110px]">Estado</TableHead>
                      <TableHead className="font-semibold w-[140px]">Próxima Dosis</TableHead>
                      <TableHead className="font-semibold w-[80px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <LoadingSkeleton />
                    ) : validVacunas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-muted/40 rounded-full mb-4">
                              <Syringe className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No hay vacunas registradas</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              Comienza registrando la primera vacuna
                            </p>
                            <Button onClick={handleAddClick} size="sm" className="gap-2">
                              <Plus className="h-4 w-4" />
                              Registrar Primera Vacuna
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      validVacunas.map((vacuna) => {
                        const estadoVencimiento = getEstadoVencimiento(vacuna.fechavencimiento)
                        const estadoProximaDosis = getEstadoProximaDosis(vacuna.proximadosis)
                        const IconVencimiento = estadoVencimiento.icon
                        const IconProximaDosis = estadoProximaDosis.icon

                        return (
                          <TableRow key={vacuna.id} className="hover:bg-muted/40 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                  <Syringe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="truncate text-sm">{vacuna.tipo || 'Sin tipo'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm truncate">{vacuna.mascota || 'Sin mascota'}</TableCell>
                            <TableCell className="text-sm">{formatDate(vacuna.fechaaplicacion)}</TableCell>
                            <TableCell>
                              <Badge className={`flex items-center gap-1 w-fit text-xs ${estadoVencimiento.className}`}>
                                <IconVencimiento className="h-3 w-3" />
                                {estadoVencimiento.text}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge className={`flex items-center gap-1 w-fit text-xs ${estadoProximaDosis.className}`}>
                                  <IconProximaDosis className="h-3 w-3" />
                                  {estadoProximaDosis.text}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(vacuna.proximadosis)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver detalles</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Footer Info */}
            {validVacunas.length > 0 && (
              <div className="mt-4 flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Mostrando <span className="font-medium text-foreground">{validVacunas.length}</span> vacuna{validVacunas.length !== 1 ? 's' : ''} registrada{validVacunas.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddVacunaModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </>
  )
}