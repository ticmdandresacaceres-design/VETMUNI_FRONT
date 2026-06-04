"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Eye, Edit, PawPrint, Syringe, Calendar, Hash, ChevronLeft, ChevronRight } from "lucide-react"
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
import { useMascotas, useDeleteMascota } from "../hooks/useMascotas"
import { Mascota } from "../types"
import EditMascotaModal from "./EditMascotaModal"
import MascotaFilters from "./MascotaFilters"
import AddVacunaModal from "../../vaccines/components/AddVacunaModal"
import { useRouter } from "next/navigation"

export default function MascotasList() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data, isLoading: loading } = useMascotas({ page, per_page: perPage })
  const deleteMascotaMutation = useDeleteMascota()

  const mascotas = data?.data ?? []
  const pagination = data?.pagination

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mascotaToDelete, setMascotaToDelete] = useState<Mascota | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [mascotaToEdit, setMascotaToEdit] = useState<Mascota | null>(null)
  const [filteredMascotas, setFilteredMascotas] = useState<Mascota[]>([])
  const [isAddVacunaModalOpen, setIsAddVacunaModalOpen] = useState(false)
  const [mascotaForVacuna, setMascotaForVacuna] = useState<Mascota | null>(null)

  const handleDeleteClick = (mascota: Mascota) => {
    setMascotaToDelete(mascota)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (mascotaToDelete) {
      await deleteMascotaMutation.mutateAsync(mascotaToDelete.id)
      setIsDeleteDialogOpen(false)
      setMascotaToDelete(null)
    }
  }

  const handleEditClick = (mascota: Mascota) => {
    setMascotaToEdit(mascota)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (mascotaId: string) => {
    router.push(`/dashboard/mascotas/${mascotaId}`)
  }

  const handleRegisterVacuna = (mascota: Mascota) => {
    setMascotaForVacuna(mascota)
    setIsAddVacunaModalOpen(true)
  }

  const displayMascotas = filteredMascotas.length > 0 ? filteredMascotas : mascotas

  const totalPerros = mascotas.filter((m) => m.species.toLowerCase() === "canino").length
  const totalGatos = mascotas.filter((m) => m.species.toLowerCase() === "felino").length
  const totalOtros = mascotas.filter((m) => !["canino", "felino"].includes(m.species.toLowerCase())).length

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <PawPrint className="h-5 w-5 text-primary" />
                  </div>
                  Gestión de Mascotas
                </CardTitle>
                <CardDescription className="text-sm">
                  Administra la información de las mascotas registradas
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <MascotaFilters mascotas={mascotas} onFilterChange={setFilteredMascotas} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <PawPrint className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
                  <p className="text-xl font-bold">{pagination?.total ?? mascotas.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <PawPrint className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Caninos</p>
                  <p className="text-xl font-bold">{totalPerros}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <PawPrint className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Felinos</p>
                  <p className="text-xl font-bold">{totalGatos}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <PawPrint className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Otros</p>
                  <p className="text-xl font-bold">{totalOtros}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold min-w-[150px]">Nombre</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Especie</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Raza</TableHead>
                      <TableHead className="font-semibold min-w-[80px]">Género</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Edad</TableHead>
                      <TableHead className="font-semibold min-w-[150px]">Dueño</TableHead>
                      <TableHead className="font-semibold min-w-[80px]">Estado</TableHead>
                      <TableHead className="w-[70px] font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <LoadingSkeleton />
                    ) : displayMascotas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-64">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-muted/40 rounded-full mb-4">
                              <PawPrint className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No hay mascotas registradas</h3>
                            <p className="text-sm text-muted-foreground">
                              Registra mascotas desde la sección de Dueños seleccionando un propietario
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayMascotas.map((mascota) => (
                        <TableRow
                          key={mascota.id}
                          className="hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => handleViewDetails(mascota.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-semibold text-primary">
                                  {mascota.name?.charAt(0).toUpperCase() || "M"}
                                </span>
                              </div>
                              <span className="truncate">{mascota.name || "Sin nombre"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {mascota.species || "Sin especie"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="truncate text-sm">{mascota.race || "Sin raza"}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 text-sm ${mascota.gender === "MACHO" ? "text-blue-600" : "text-pink-600"
                                }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${mascota.gender === "MACHO" ? "bg-blue-500" : "bg-pink-500"
                                  }`}
                              ></span>
                              {mascota.gender || "Sin género"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span>
                                {mascota.age || "Sin edad"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-sm">
                                {mascota.user?.name || "Sin dueño"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={mascota.status === "ADOPTADO" ? "default" : "secondary"}
                              className="font-medium text-xs"
                            >
                              {mascota.status === "ADOPTADO" ? "Adoptado" : "En Adopción"}
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
                                <DropdownMenuItem
                                  onClick={() => handleRegisterVacuna(mascota)}
                                  className="cursor-pointer"
                                >
                                  <Syringe className="mr-2 h-4 w-4" />
                                  Registrar Vacuna
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

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Página {pagination.current_page} de {pagination.last_page} — {pagination.total} registros
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                    disabled={page === pagination.last_page || loading}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {displayMascotas.length > 0 && !pagination?.last_page && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                <p>
                  Mostrando <span className="font-medium text-foreground">{displayMascotas.length}</span> de {mascotas.length} mascota{mascotas.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs">
                  Haz clic en una fila para ver detalles completos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {mascotaToEdit && (
        <EditMascotaModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mascota={mascotaToEdit}
        />
      )}

      {mascotaForVacuna && (
        <AddVacunaModal
          open={isAddVacunaModalOpen}
          onOpenChange={setIsAddVacunaModalOpen}
          petId={mascotaForVacuna.id}
          petName={mascotaForVacuna.name}
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
              <p>
                Esta acción no se puede deshacer. Se eliminará permanentemente la mascota:
              </p>
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="font-semibold text-foreground">{mascotaToDelete?.name}</p>
                <p className="text-sm">
                  {mascotaToDelete?.species} - {mascotaToDelete?.race}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMascotaMutation.isPending}
            >
              {deleteMascotaMutation.isPending ? "Eliminando..." : "Eliminar definitivamente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function LoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-full max-w-[200px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}
