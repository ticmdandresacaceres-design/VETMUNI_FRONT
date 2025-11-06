"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Trash2, Eye, Phone, Mail, IdCard, Plus, Edit } from "lucide-react"
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
import { useDuenoContext } from "../context/DuenoContext"
import { DuenoDetails } from "../types"
import AddDuenoModal from "./AddDuenoModal"
import EditDuenoModal from "./EditDuenoModal"

export default function DuenosList() {
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

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  // No renderizar hasta que esté montado
  if (!isMounted) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Mascotas</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LoadingSkeleton />
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Validar que duenos sea un array válido
  const validDuenos = Array.isArray(duenos) ? duenos.filter(dueno => dueno && dueno.id) : []

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Dueños</h2>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Dueño
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Mascotas</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingSkeleton />
            ) : validDuenos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No se encontraron dueños registrados
                </TableCell>
              </TableRow>
            ) : (
              validDuenos.map((dueno) => (
                <TableRow key={dueno.id}>
                  <TableCell className="font-medium">
                    {dueno.nombre || 'Sin nombre'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      {dueno.DNI || 'Sin DNI'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {dueno.correo || 'Sin correo'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {dueno.telefono || 'Sin teléfono'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {dueno.direccion || 'Sin dirección'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {dueno.cantidadMascota || 0} mascota{(dueno.cantidadMascota || 0) !== 1 ? 's' : ''}
                    </Badge>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(dueno)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
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
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el dueño{" "}
              <strong>{duenoToDelete?.nombre}</strong> (DNI: {duenoToDelete?.DNI}) del sistema.
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
    </>
  )
}