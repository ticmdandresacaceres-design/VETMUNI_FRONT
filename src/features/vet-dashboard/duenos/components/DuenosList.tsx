"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Trash2, Eye, Phone, Mail, IdCard, Plus, Edit, Users, Search, Filter } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDuenoContext } from "../context/DuenoContext"
import { DuenoDetails } from "../types"
import AddDuenoModal from "./AddDuenoModal"
import EditDuenoModal from "./EditDuenoModal"
import DuenoFilters from "./DuenoFilters"
import { useRouter } from "next/navigation"

export default function DuenosList() {
  const router = useRouter()
  const { duenos, loading, getDuenos, deleteDueno } = useDuenoContext()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [duenoToDelete, setDuenoToDelete] = useState<DuenoDetails | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [duenoToEdit, setDuenoToEdit] = useState<DuenoDetails | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      getDuenos()
    }
  }, [getDuenos, isMounted])

  const handleDeleteClick = (dueno: DuenoDetails) => {
    setDuenoToDelete(dueno)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (duenoToDelete) {
      await deleteDueno(duenoToDelete.id)
      setIsDeleteDialogOpen(false)
      setDuenoToDelete(null)
    }
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleEditClick = (dueno: DuenoDetails) => {
    setDuenoToEdit(dueno)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (duenoId: string) => {
    router.push(`/dashboard/veterinaria/duenos/${duenoId}`)
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-full max-w-[200px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[60px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  // No renderizar hasta que esté montado
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
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
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

  // Validar que duenos sea un array válido
  const validDuenos = Array.isArray(duenos) ? duenos.filter(dueno => dueno && dueno.id) : []

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Gestión de Propietarios
                </CardTitle>
                <CardDescription className="text-sm">
                  Administra la información de los dueños de mascotas registrados
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <DuenoFilters />
                <Button onClick={handleAddClick} size="default" className="gap-2 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Agregar Propietario
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Stats Bar - Más compacta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Mostrando</p>
                  <p className="text-xl font-bold">{validDuenos.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <IdCard className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Con Mascotas</p>
                  <p className="text-xl font-bold">
                    {validDuenos.filter(d => (d.cantidadmascotas || 0) > 0).length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sin Mascotas</p>
                  <p className="text-xl font-bold">
                    {validDuenos.filter(d => (d.cantidadmascotas || 0) === 0).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Table - Con scroll horizontal controlado */}
            <div className="rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold min-w-[180px]">Nombre Completo</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">DNI</TableHead>
                      <TableHead className="font-semibold min-w-[200px]">Correo</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Teléfono</TableHead>
                      <TableHead className="font-semibold min-w-[150px]">Dirección</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Mascotas</TableHead>
                      <TableHead className="w-[70px] font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <LoadingSkeleton />
                    ) : validDuenos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-muted/40 rounded-full mb-4">
                              <Users className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No hay propietarios registrados</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              Comienza agregando el primer propietario al sistema
                            </p>
                            <Button onClick={handleAddClick} size="sm" className="gap-2">
                              <Plus className="h-4 w-4" />
                              Agregar Primer Propietario
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      validDuenos.map((dueno) => (
                        <TableRow 
                          key={dueno.id} 
                          className="hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => handleViewDetails(dueno.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-semibold text-primary">
                                  {dueno.nombre?.charAt(0).toUpperCase() || 'N'}
                                </span>
                              </div>
                              <span className="truncate">{dueno.nombre || 'Sin nombre'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <IdCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-sm">{dueno.dni || 'Sin DNI'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-sm" title={dueno.correo}>
                                {dueno.correo || 'Sin correo'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-sm">{dueno.telefono || 'Sin teléfono'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="truncate block text-sm" title={dueno.direccion}>
                              {dueno.direccion || 'Sin dirección'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={dueno.cantidadmascotas && dueno.cantidadmascotas > 0 ? "default" : "secondary"}
                              className="font-medium text-xs"
                            >
                              {dueno.cantidadmascotas || 0}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                >
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
                                  onClick={() => handleViewDetails(dueno.id)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleEditClick(dueno)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => handleDeleteClick(dueno)}
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
              </div>
            </div>

            {/* Footer Info */}
            {validDuenos.length > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                <p>
                  Mostrando <span className="font-medium text-foreground">{validDuenos.length}</span> propietario{validDuenos.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs">
                  Haz clic en una fila para ver detalles completos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Dueño Modal */}
      <AddDuenoModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Edit Dueño Modal */}
      {duenoToEdit && (
        <EditDuenoModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          dueno={duenoToEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              ¿Estás seguro de eliminar este propietario?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Esta acción no se puede deshacer. Se eliminará permanentemente el propietario:
              </p>
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="font-semibold text-foreground">{duenoToDelete?.nombre}</p>
                <p className="text-sm flex items-center gap-2">
                  <IdCard className="h-3 w-3" />
                  DNI: {duenoToDelete?.dni}
                </p>
                {duenoToDelete?.cantidadmascotas && duenoToDelete.cantidadmascotas > 0 && (
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Este propietario tiene {duenoToDelete.cantidadmascotas} mascota{duenoToDelete.cantidadmascotas !== 1 ? 's' : ''} registrada{duenoToDelete.cantidadmascotas !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}