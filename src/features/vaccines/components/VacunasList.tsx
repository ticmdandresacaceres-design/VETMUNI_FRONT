"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Trash2, Edit, Syringe, Calendar, PawPrint, ChevronLeft, ChevronRight } from "lucide-react"
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
import { useVacunas, useDeleteVacuna } from "../hooks/useVacunas"
import { Vacuna } from "../types"
import EditVacunaModal from "./EditVacunaModal"
import VacunaFilters from "./VacunaFilters"

export default function VacunasList() {
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data, isLoading: loading } = useVacunas({ page, per_page: perPage })
  const deleteVacunaMutation = useDeleteVacuna()

  const vacunas = data?.data ?? []
  const pagination = data?.pagination

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vacunaToDelete, setVacunaToDelete] = useState<Vacuna | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [vacunaToEdit, setVacunaToEdit] = useState<Vacuna | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [filteredVacunas, setFilteredVacunas] = useState<Vacuna[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDeleteClick = (vacuna: Vacuna) => {
    setVacunaToDelete(vacuna)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (vacunaToDelete) {
      await deleteVacunaMutation.mutateAsync(vacunaToDelete.id)
      setIsDeleteDialogOpen(false)
      setVacunaToDelete(null)
    }
  }

  const handleEditClick = (vacuna: Vacuna) => {
    setVacunaToEdit(vacuna)
    setIsEditModalOpen(true)
  }

  const getVacunaStatus = (expirationDate: string) => {
    const now = new Date()
    const exp = new Date(expirationDate)
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: "Vencida", variant: "destructive" as const }
    if (diffDays <= 30) return { label: "Próxima a vencer", variant: "secondary" as const }
    return { label: "Vigente", variant: "default" as const }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-full max-w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  if (!isMounted) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-t-4 border-t-primary">
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
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayVacunas = filteredVacunas.length > 0 ? filteredVacunas : vacunas

  const vacunasVigentes = vacunas.filter((v) => getVacunaStatus(v.expiration_date).label === "Vigente").length
  const vacunasProximas = vacunas.filter((v) => getVacunaStatus(v.expiration_date).label === "Próxima a vencer").length
  const vacunasVencidas = vacunas.filter((v) => getVacunaStatus(v.expiration_date).label === "Vencida").length

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="pb-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Syringe className="h-5 w-5 text-primary" />
                  </div>
                  Gestión de Vacunas
                </CardTitle>
                <CardDescription className="text-sm">
                  Administra el registro de vacunas aplicadas
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <VacunaFilters vacunas={vacunas} onFilterChange={setFilteredVacunas} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Syringe className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
                  <p className="text-xl font-bold">{pagination?.total ?? vacunas.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Syringe className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vigentes</p>
                  <p className="text-xl font-bold">{vacunasVigentes}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Próximas</p>
                  <p className="text-xl font-bold">{vacunasProximas}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Syringe className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vencidas</p>
                  <p className="text-xl font-bold">{vacunasVencidas}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold min-w-[150px]">Tipo</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Fecha Aplicación</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Vigencia</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Fecha Expiración</TableHead>
                      <TableHead className="font-semibold min-w-[150px]">Mascota</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Estado</TableHead>
                      <TableHead className="w-[70px] font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <LoadingSkeleton />
                    ) : displayVacunas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-muted/40 rounded-full mb-4">
                              <Syringe className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">No hay vacunas registradas</h3>
                            <p className="text-sm text-muted-foreground">
                              Registra vacunas desde la sección de Mascotas seleccionando un animal
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayVacunas.map((vacuna) => {
                        const status = getVacunaStatus(vacuna.expiration_date)
                        return (
                          <TableRow key={vacuna.id} className="hover:bg-muted/40 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                                  <Syringe className="h-4 w-4 text-primary" />
                                </div>
                                <span>{vacuna.type}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span>
                                  {vacuna.aplication_date.split("T")[0].split("-").reverse().join("/")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{vacuna.months_validity} meses</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span>
                                  {vacuna.expiration_date.split("T")[0].split("-").reverse().join("/")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <PawPrint className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="truncate text-sm">
                                  {vacuna.pet?.name || "Sin mascota"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={status.variant === "secondary" ? "secondary" : status.variant}
                                className="font-medium text-xs"
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
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
                                    onClick={() => handleEditClick(vacuna)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
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

            {displayVacunas.length > 0 && !pagination?.last_page && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                <p>
                  Mostrando <span className="font-medium text-foreground">{displayVacunas.length}</span> de {vacunas.length} vacuna{vacunas.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {vacunaToEdit && (
        <EditVacunaModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          vacuna={vacunaToEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              ¿Estás seguro de eliminar esta vacuna?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Esta acción no se puede deshacer. Se eliminará permanentemente la vacuna:
              </p>
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="font-semibold text-foreground">{vacunaToDelete?.type}</p>
                <p className="text-sm">
                  {vacunaToDelete?.pet?.name || "Sin mascota"}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteVacunaMutation.isPending}
            >
              {deleteVacunaMutation.isPending ? "Eliminando..." : "Eliminar definitivamente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
