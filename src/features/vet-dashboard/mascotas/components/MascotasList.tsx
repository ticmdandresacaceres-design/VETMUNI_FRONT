"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash2, Eye, Heart, Plus, Edit, PawPrint, Dog, Cat, Users, Info } from "lucide-react"
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
import { useMascotaContext } from "../context/MascotaContext"
import { MascotaDetails } from "../types"
import AddMascotaModal from "./AddMascotaModal"
import EditMascotaModal from "./EditMascotaModal"
import MascotaFilters from "./MascotaFilters"

export default function MascotasList() {
  const router = useRouter()
  const { mascotas, loading, getMascotas, deleteMascota } = useMascotaContext()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mascotaToDelete, setMascotaToDelete] = useState<MascotaDetails | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [mascotaToEdit, setMascotaToEdit] = useState<MascotaDetails | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      getMascotas()
    }
  }, [getMascotas, isMounted])

  const handleDeleteClick = (mascota: MascotaDetails) => {
    setMascotaToDelete(mascota)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (mascotaToDelete) {
      await deleteMascota(mascotaToDelete.id)
      setIsDeleteDialogOpen(false)
      setMascotaToDelete(null)
    }
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleEditClick = (mascota: MascotaDetails) => {
    setMascotaToEdit(mascota)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (mascotaId: string) => {
    router.push(`/dashboard/veterinaria/mascotas/${mascotaId}`)
  }

  const getEspecieColor = (especie: string) => {
    const especieLower = especie?.toLowerCase() || ''
    const colors = {
      'perro': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0',
      'gato': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-0',
      'ave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0',
      'conejo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0',
      'hamster': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 border-0',
    }
    return colors[especieLower as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-0'
  }

  const getSexoIcon = (sexo: string) => {
    return sexo?.toLowerCase() === 'macho' ? '♂' : '♀'
  }

  const getEspecieBadge = (especie: string) => {
    const especieLower = especie?.toLowerCase() || ''
    const badges = {
      'perro': 'default' as const,
      'gato': 'secondary' as const,
      'ave': 'outline' as const,
      'conejo': 'outline' as const,
      'hamster': 'outline' as const,
    }
    return badges[especieLower as keyof typeof badges] || 'outline' as const
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Identificador</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Temperamento</TableHead>
                      <TableHead>Dueño</TableHead>
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

  const validMascotas = Array.isArray(mascotas) ? mascotas.filter(mascota => mascota && mascota.id) : []

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
                    <PawPrint className="h-5 w-5 text-primary" />
                  </div>
                  Gestión de Mascotas
                </CardTitle>
                <CardDescription className="text-sm">
                  Administra la información de las mascotas registradas en el sistema
                </CardDescription>
              </div>
              
              <Button onClick={handleAddClick} size="default" className="gap-2 shadow-sm lg:shrink-0">
                <Plus className="h-4 w-4" />
                Agregar Mascota
              </Button>
            </div>

            {/* Filtros - Segunda fila, ancho completo con separación */}
            <div className="w-full pt-2">
              <MascotaFilters />
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Stats Bar - Solo de lo que se muestra */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <PawPrint className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Mostrando</p>
                  <p className="text-xl font-bold">{validMascotas.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-blue-500/10 rounded-lg shrink-0">
                  <Dog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Perros</p>
                  <p className="text-xl font-bold">
                    {validMascotas.filter(m => m.especie?.toLowerCase() === 'perro').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-purple-500/10 rounded-lg shrink-0">
                  <Cat className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Gatos</p>
                  <p className="text-xl font-bold">
                    {validMascotas.filter(m => m.especie?.toLowerCase() === 'gato').length}
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
                      <TableHead className="font-semibold w-[140px]">Nombre</TableHead>
                      <TableHead className="font-semibold w-[110px]">Identificador</TableHead>
                      <TableHead className="font-semibold w-[90px]">Especie</TableHead>
                      <TableHead className="font-semibold w-[100px]">Raza</TableHead>
                      <TableHead className="font-semibold w-[90px]">Edad</TableHead>
                      <TableHead className="font-semibold w-20">Sexo</TableHead>
                      <TableHead className="font-semibold w-[110px]">Temperamento</TableHead>
                      <TableHead className="font-semibold w-[140px]">Dueño</TableHead>
                      <TableHead className="font-semibold w-20">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <LoadingSkeleton />
                    ) : validMascotas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-64">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-muted/40 rounded-full mb-4">
                              <PawPrint className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No hay mascotas registradas</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              Comienza agregando la primera mascota al sistema
                            </p>
                            <Button onClick={handleAddClick} size="sm" className="gap-2">
                              <Plus className="h-4 w-4" />
                              Agregar Primera Mascota
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      validMascotas.map((mascota) => (
                        <TableRow 
                          key={mascota.id}
                          className="hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => handleViewDetails(mascota.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Heart className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <span className="truncate text-sm">{mascota.nombre || 'Sin nombre'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs truncate">
                            {mascota.identificador || 'Sin ID'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getEspecieBadge(mascota.especie)} className="text-xs font-medium">
                              {mascota.especie || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm truncate">
                            {mascota.raza || 'Sin raza'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {mascota.edad || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-base">{getSexoIcon(mascota.sexo)}</span>
                              <span>{mascota.sexo || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                              {mascota.temperamento || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm truncate" title={mascota.dueno}>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-xs">{mascota.dueno || 'Sin dueño'}</span>
                            </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
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
                                  onClick={() => handleViewDetails(mascota.id)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleEditClick(mascota)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => handleDeleteClick(mascota)}
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
            {validMascotas.length > 0 && (
              <div className="mt-4 flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>
                    Mostrando <span className="font-medium text-foreground">{validMascotas.length}</span> mascota{validMascotas.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Haz clic en una fila para ver detalles
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddMascotaModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {mascotaToEdit && (
        <EditMascotaModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mascota={mascotaToEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              ¿Estás seguro de eliminar esta mascota?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Esta acción no se puede deshacer. Se eliminará permanentemente:</p>
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="font-semibold text-foreground">{mascotaToDelete?.nombre}</p>
                <p className="text-sm">Especie: {mascotaToDelete?.especie}</p>
                <p className="text-sm">Dueño: {mascotaToDelete?.dueno}</p>
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