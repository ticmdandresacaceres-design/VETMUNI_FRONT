"use client"

import { useEffect, useState } from "react"
import { Eye, Syringe, Plus, Pencil, Trash2, Calendar, Clock, AlertTriangle, Shield, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useVacunaContext } from "../context/VacunaContext"
import { VacunaDetails } from "../types"
import AddVacunaModal from "./AddVacunaModal"
import EditVacunaModal from "./EditVacunaModal"
import VacunaFilters from "./VacunaFilters"
import { formatDate } from "@/src/lib/utils/utils"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"

export default function VacunasList() {
  const { vacunas, loading, getVacunas, deleteVacuna } = useVacunaContext()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [vacunaToEdit, setVacunaToEdit] = useState<VacunaDetails | null>(null)
  const [vacunaToDelete, setVacunaToDelete] = useState<VacunaDetails | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

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

  const handleEditClick = (vacuna: VacunaDetails) => {
    setVacunaToEdit(vacuna)
    setIsEditModalOpen(true)
  }

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open)
    if (!open) {
      setVacunaToEdit(null)
    }
  }

  const handleDeleteClick = (vacuna: VacunaDetails) => {
    setVacunaToDelete(vacuna)
    showConfirmDialog(
      {
        title: "Confirmar eliminación",
        message: `¿Estás seguro de eliminar la vacuna "${vacuna.tipo}" de ${vacuna.mascota}?\n\nEsta acción no se puede deshacer.`,
        buttons: {
          cancel: "Cancelar",
          confirm: "Sí, eliminar"
        }
      },
      async () => {
        setIsDeleting(true)
        try {
          await deleteVacuna(vacuna.id)
          setVacunaToDelete(null)
        } finally {
          setIsDeleting(false)
        }
      }
    )
  }

  const getEstadoVencimiento = (fechaVencimiento: string) => {
    const hoy = new Date()
    const vencimiento = new Date(fechaVencimiento)
    const diferenciaDias = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

    if (diferenciaDias < 0) {
      return {
        text: "Vencida",
        variant: "destructive" as const,
        icon: AlertTriangle
      }
    } else if (diferenciaDias <= 30) {
      return {
        text: "Por vencer",
        variant: "secondary" as const,
        icon: Clock
      }
    } else {
      return {
        text: "Vigente",
        variant: "default" as const,
        icon: CheckCircle
      }
    }
  }

  const getEstadoProximaDosis = (fechaProximaDosis: string) => {
    const hoy = new Date()
    const proximaDosis = new Date(fechaProximaDosis)
    const diferenciaDias = Math.ceil((proximaDosis.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

    if (diferenciaDias < 0) {
      return {
        text: "Atrasada",
        variant: "destructive" as const,
        icon: AlertTriangle
      }
    } else if (diferenciaDias <= 15) {
      return {
        text: "Próxima",
        variant: "secondary" as const,
        icon: Clock
      }
    } else {
      return {
        text: "Programada",
        variant: "default" as const,
        icon: Calendar
      }
    }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const validVacunas = Array.isArray(vacunas) ? vacunas.filter(vacuna => vacuna && vacuna.id) : []

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
                  Registro de Vacunas
                </CardTitle>
                <CardDescription className="text-sm">
                  Administra y da seguimiento a las vacunas de tus mascotas
                </CardDescription>
              </div>
              
              <Button onClick={handleAddClick} size="default" className="gap-2 shadow-sm lg:shrink-0">
                <Plus className="h-4 w-4" />
                Registrar Vacuna
              </Button>
            </div>

            {/* Filtros - Segunda fila, ancho completo con separación */}
            <div className="w-full pt-2">
              <VacunaFilters />
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Stats Bar - Solo de lo que se muestra */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vigentes</p>
                  <p className="text-xl font-bold">
                    {validVacunas.filter(v => getEstadoVencimiento(v.fechavencimiento).text === "Vigente").length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-orange-500/10 rounded-lg shrink-0">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Próximas</p>
                  <p className="text-xl font-bold">
                    {validVacunas.filter(v => getEstadoProximaDosis(v.proximadosis).text === "Próxima").length}
                  </p>
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
                      <TableHead className="font-semibold w-20">Acciones</TableHead>
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
                                <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                  <Syringe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="truncate text-sm">{vacuna.tipo || 'Sin tipo'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm truncate">{vacuna.mascota || 'Sin mascota'}</TableCell>
                            <TableCell className="text-sm">{formatDate(vacuna.fechaaplicacion)}</TableCell>
                            <TableCell>
                              <Badge variant={estadoVencimiento.variant} className="flex items-center gap-1 w-fit text-xs">
                                <IconVencimiento className="h-3 w-3" />
                                {estadoVencimiento.text}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={estadoProximaDosis.variant} className="flex items-center gap-1 w-fit text-xs">
                                  <IconProximaDosis className="h-3 w-3" />
                                  {estadoProximaDosis.text}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(vacuna.proximadosis)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10">
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel className="text-xs font-semibold">
                                    Acciones
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="cursor-pointer"
                                    onClick={() => handleEditClick(vacuna)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onClick={() => handleDeleteClick(vacuna)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                  <Info className="h-4 w-4 shrink-0" />
                  <span>
                    Mostrando <span className="font-medium text-foreground">{validVacunas.length}</span> vacuna{validVacunas.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Gestiona las vacunas de tus mascotas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddVacunaModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {vacunaToEdit && (
        <EditVacunaModal
          open={isEditModalOpen}
          onOpenChange={handleEditModalClose}
          vacuna={vacunaToEdit}
        />
      )}

      {options && (
        <ConfirmDialog
          open={isOpen}
          onOpenChange={hideConfirmDialog}
          title={options.title}
          message={options.message}
          buttons={options.buttons}
          onConfirm={handleConfirm}
          loading={isDeleting}
        />
      )}
    </>
  )
}