"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash2, Eye, Heart, Palette, Plus, Edit } from "lucide-react"
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

  useEffect(() => {
    getMascotas()
  }, [getMascotas])

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
    router.push(`/dashboard/admin/mascotas/${mascotaId}`)
  }

  const getEspecieColor = (especie: string) => {
    const colors = {
      'Perro': 'bg-blue-100 text-blue-800',
      'Gato': 'bg-purple-100 text-purple-800',
      'Ave': 'bg-yellow-100 text-yellow-800',
      'Conejo': 'bg-green-100 text-green-800',
      'Hamster': 'bg-pink-100 text-pink-800',
      'Otro': 'bg-gray-100 text-gray-800'
    }
    return colors[especie as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSexoIcon = (sexo: string) => {
    return sexo === 'Macho' ? '♂️' : '♀️'
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  // Validar que mascotas sea un array válido
  const validMascotas = Array.isArray(mascotas) ? mascotas.filter(mascota => mascota && mascota.id) : []

  return (
    <div className="space-y-6">
      {/* Header con título y botón de agregar - SIEMPRE VISIBLE */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl font-bold">Lista de Mascotas</h2>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Mascota
        </Button>
      </div>

      {/* Filtros - SIEMPRE VISIBLES */}
      <div className="space-y-4">
        <MascotaFilters />
      </div>

      {/* Tabla de mascotas - SOLO ESTA PARTE CARGA */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Identificador</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Temperamento</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingSkeleton />
            ) : validMascotas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No se encontraron mascotas registradas
                </TableCell>
              </TableRow>
            ) : (
              validMascotas.map((mascota) => (
                <TableRow key={mascota.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      {mascota.nombre || 'Sin nombre'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs w-24 truncate">
                    {mascota.identificador || 'Sin identificador'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getEspecieColor(mascota.especie)}>
                      {mascota.especie || 'Sin especie'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {mascota.raza || 'Sin raza'}
                  </TableCell>
                  <TableCell>
                    {mascota.edad || 'Sin edad'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{getSexoIcon(mascota.sexo)}</span>
                      {mascota.sexo || 'Sin especificar'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {mascota.temperamento || 'Sin especificar'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs w-24 truncate">
                    {mascota.dueno || 'Sin dueño asignado'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(mascota.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(mascota)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
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

      {/* Add Mascota Modal */}
      <AddMascotaModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Edit Mascota Modal */}
      {mascotaToEdit && (
        <EditMascotaModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mascota={mascotaToEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la mascota{" "}
              <strong>{mascotaToDelete?.nombre}</strong> ({mascotaToDelete?.especie}) del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}