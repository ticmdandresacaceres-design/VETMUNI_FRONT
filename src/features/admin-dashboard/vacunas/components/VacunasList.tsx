"use client"

import { useEffect, useState } from "react"
import { Eye, Syringe, Plus, Calendar, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useVacunaContext } from "../context/VacunaContext"
import AddVacunaModal from "./AddVacunaModal"
import VacunaFilters from "./VacunaFilters"
import { formatDate } from "@/src/lib/utils/utils"

export default function VacunasList() {
  const { vacunas, loading, getVacunas } = useVacunaContext()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    getVacunas()
  }, [getVacunas])

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  // Función para calcular días hasta una fecha
  const calcularDiasHasta = (fecha: string): number => {
    const hoy = new Date()
    const fechaObjetivo = new Date(fecha)
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
        className: ""
      }
    } else if (dias <= 30) {
      return { 
        variant: "secondary" as const, 
        icon: Clock, 
        text: "Por vencer",
        className: "bg-yellow-100 text-yellow-800"
      }
    } else {
      return { 
        variant: "default" as const, 
        icon: Clock, 
        text: "Vigente",
        className: "bg-green-100 text-green-800"
      }
    }
  }

  // Función para obtener el estado de próxima dosis
  const getEstadoProximaDosis = (fechaProximaDosis: string) => {
    const dias = calcularDiasHasta(fechaProximaDosis)
    
    if (dias < 0) {
      return { 
        variant: "destructive" as const, 
        icon: Calendar, 
        text: "Atrasada",
        className: ""
      }
    } else if (dias <= 7) {
      return { 
        variant: "secondary" as const, 
        icon: Calendar, 
        text: "Próxima",
        className: "bg-orange-100 text-orange-800"
      }
    } else {
      return { 
        variant: "outline" as const, 
        icon: Calendar, 
        text: "Programada",
        className: ""
      }
    }
  }

  const LoadingSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Mascota</TableHead>
            <TableHead>Fecha Aplicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Próxima Dosis</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(8)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Validar que vacunas sea un array válido
  const validVacunas = Array.isArray(vacunas) ? vacunas.filter(vacuna => vacuna && vacuna.id) : []

  return (
    <div className="space-y-6">
      {/* Header con título y botón de agregar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Registro de Vacunas</h2>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Vacuna
        </Button>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <VacunaFilters />
      </div>

      {/* Tabla de vacunas */}
      {loading ? (
        <LoadingSkeleton />
      ) : validVacunas.length === 0 ? (
        <div className="text-center py-12">
          <Syringe className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No hay vacunas registradas</h3>
          <p className="text-muted-foreground">Comienza registrando la primera vacuna</p>
          <Button onClick={handleAddClick} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Registrar Primera Vacuna
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Fecha Aplicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Próxima Dosis</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validVacunas.map((vacuna) => {
                const estadoVencimiento = getEstadoVencimiento(vacuna.fechavencimiento)
                const estadoProximaDosis = getEstadoProximaDosis(vacuna.proximadosis)
                const IconVencimiento = estadoVencimiento.icon
                const IconProximaDosis = estadoProximaDosis.icon

                return (
                  <TableRow key={vacuna.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-blue-600" />
                        {vacuna.tipo}
                      </div>
                    </TableCell>
                    <TableCell>{vacuna.mascota}</TableCell>
                    <TableCell>{formatDate(vacuna.fechaaplicacion)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={estadoVencimiento.variant}
                        className={`flex items-center gap-1 w-fit ${estadoVencimiento.className}`}
                      >
                        <IconVencimiento className="h-3 w-3" />
                        {estadoVencimiento.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge 
                          variant={estadoProximaDosis.variant}
                          className={`flex items-center gap-1 w-fit ${estadoProximaDosis.className}`}
                        >
                          <IconProximaDosis className="h-3 w-3" />
                          {estadoProximaDosis.text}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(vacuna.proximadosis)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles de {vacuna.tipo}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Vacuna Modal */}
      <AddVacunaModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  )
}