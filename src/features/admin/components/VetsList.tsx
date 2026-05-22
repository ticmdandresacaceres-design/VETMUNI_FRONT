"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Phone, Mail, IdCard, UserCheck, UserX, Edit, Trash2 } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVeterinarios, useUpdateVeterinario, useDeleteVeterinario } from "../hooks/useVet"
import { Veterinario } from "../types"
import { RegisterFormModal } from "./RegisterFormModal"

export default function VetsList() {
  const { data: veterinarians, isLoading: loading } = useVeterinarios()
  const updateVetMutation = useUpdateVeterinario()
  const deleteVetMutation = useDeleteVeterinario()
  
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [vetToToggle, setVetToToggle] = useState<Veterinario | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vetToDelete, setVetToDelete] = useState<Veterinario | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [vetToEdit, setVetToEdit] = useState<Veterinario | null>(null)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (vetToEdit) {
      setEditName(vetToEdit.name)
      setEditPhone(vetToEdit.phone)
      setEditAddress(vetToEdit.address)
    }
  }, [vetToEdit])

  const handleToggleClick = (vet: Veterinario) => {
    setVetToToggle(vet)
    setIsToggleDialogOpen(true)
  }

  const handleToggleConfirm = async () => {
    if (vetToToggle) {
      await updateVetMutation.mutateAsync({ 
        id: vetToToggle.id, 
        data: { active: !vetToToggle.active } 
      })
      setIsToggleDialogOpen(false)
      setVetToToggle(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (vetToDelete) {
      await deleteVetMutation.mutateAsync(vetToDelete.id)
      setIsDeleteDialogOpen(false)
      setVetToDelete(null)
    }
  }

  const handleEditSave = async () => {
    if (!vetToEdit) return
    await updateVetMutation.mutateAsync({
      id: vetToEdit.id,
      data: { name: editName, phone: editPhone, address: editAddress },
    })
    setIsEditDialogOpen(false)
    setVetToEdit(null)
  }

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  const validVeterinarians = Array.isArray(veterinarians) ? veterinarians : []

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsRegisterModalOpen(true)}>
          Registrar Veterinario
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">DNI</TableHead>
              <TableHead className="font-semibold">Correo</TableHead>
              <TableHead className="font-semibold">Teléfono</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="w-[70px] font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              </>
            ) : validVeterinarians.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <UserX className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No hay veterinarios registrados
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              validVeterinarians.map((vet) => (
                <TableRow key={vet.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {vet.name?.charAt(0).toUpperCase() || 'V'}
                        </span>
                      </div>
                      {vet.name || 'Sin nombre'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{vet.dni || 'Sin DNI'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vet.email || 'Sin correo'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{vet.phone || 'Sin teléfono'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vet.active ? "default" : "secondary"}>
                      {vet.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setVetToEdit(vet)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleClick(vet)}>
                          {vet.active ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setVetToDelete(vet)}
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

      <RegisterFormModal
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Veterinario</DialogTitle>
            <DialogDescription>
              Modifica la información de {vetToEdit?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave} disabled={updateVetMutation.isPending}>
              {updateVetMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Active Dialog */}
      <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {vetToToggle?.active ? "Desactivar" : "Activar"} veterinario
            </AlertDialogTitle>
            <AlertDialogDescription>
              {vetToToggle?.active
                ? `El veterinario ${vetToToggle?.name} no podrá acceder al sistema.`
                : `El veterinario ${vetToToggle?.name} podrá acceder al sistema nuevamente.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleConfirm}
              disabled={updateVetMutation.isPending}
            >
              {updateVetMutation.isPending ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar veterinario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a{" "}
              <strong>{vetToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteVetMutation.isPending}
            >
              {deleteVetMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
