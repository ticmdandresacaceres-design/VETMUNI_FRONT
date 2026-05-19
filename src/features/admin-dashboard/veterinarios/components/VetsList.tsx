"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Shield, ShieldOff, Phone, Mail, IdCard, UserCheck, UserX } from "lucide-react"
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
import { useVeterinarios, useUpdateVeterinario } from "../hooks/useVet"
import { Veterinario } from "../types"
import { RegisterFormModal } from "./RegisterFormModal"

export default function VetsList() {
  const { data: veterinarians, isLoading: loading } = useVeterinarios()
  const updateVetMutation = useUpdateVeterinario()
  
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [vetToToggle, setVetToToggle] = useState<Veterinario | null>(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  // Badge para estado del usuario (activo/inactivo)
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge variant="default" className="bg-grandient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 dark:from-green-500/20 dark:to-green-500/10 dark:text-green-400 dark:border-green-500/30">
        <UserCheck className="mr-1 h-3 w-3" />
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 dark:from-gray-500/20 dark:to-gray-500/10 dark:text-gray-400 dark:border-gray-500/30">
        <UserX className="mr-1 h-3 w-3" />
        Inactivo
      </Badge>
    )
  }

  // Badge para estado de la cuenta (bloqueada/funcionando) - Usaremos 'active' como referencia si no hay otro campo
  const getAccountStatusBadge = (active: boolean) => {
    return active ? (
      <Badge variant="default" className="bg-grandient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 dark:from-emerald-500/20 dark:to-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
        <Shield className="mr-1 h-3 w-3" />
        Funcionando
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-linear-to-r from-red-50 to-red-100 text-red-700 border border-red-200 dark:from-red-500/20 dark:to-red-500/10 dark:text-red-400 dark:border-red-500/30">
        <ShieldOff className="mr-1 h-3 w-3" />
        Bloqueada
      </Badge>
    )
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
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="rounded-xl border border-border/50 bg-linear-to-br from-card/50 to-card backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Nombre Completo</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Cuenta</TableHead>
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

  const validVeterinarians = Array.isArray(veterinarians) ? veterinarians : []

  return (
    <>
      {/* Botón para abrir modal de registro si es necesario */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsRegisterModalOpen(true)}>
          Registrar Veterinario
        </Button>
      </div>

      {/* Tabla mejorada */}
      <div className="rounded-xl border border-border/50 bg-linear-to-br from-card/50 to-card backdrop-blur-sm shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 bg-linear-to-r from-muted/50 to-muted/30">
              <TableHead className="font-semibold">Nombre Completo</TableHead>
              <TableHead className="font-semibold">DNI</TableHead>
              <TableHead className="font-semibold">Correo</TableHead>
              <TableHead className="font-semibold">Teléfono</TableHead>
              <TableHead className="font-semibold">Usuario</TableHead>
              <TableHead className="font-semibold">Cuenta</TableHead>
              <TableHead className="w-[70px] font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingSkeleton />
            ) : validVeterinarians.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <UserX className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <p className="text-lg font-medium text-muted-foreground">
                        No hay veterinarios registrados
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Comienza agregando tu primer veterinario al sistema
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              validVeterinarians.map((vet, index) => (
                <TableRow 
                  key={vet.id} 
                  className={`border-border/50 hover:bg-linear-to-r hover:from-muted/30 hover:to-transparent transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-muted/20' : ''
                  }`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
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
                  <TableCell>{getStatusBadge(vet.active)}</TableCell>
                  <TableCell>{getAccountStatusBadge(vet.active)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors"
                        >
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleToggleClick(vet)}
                          className={`cursor-pointer ${
                            vet.active 
                              ? 'text-red-600 hover:text-red-700 focus:text-red-700' 
                              : 'text-green-600 hover:text-green-700 focus:text-green-700'
                          }`}
                        >
                          {vet.active ? (
                            <>
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Bloquear Cuenta
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Desbloquear Cuenta
                            </>
                          )}
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

      <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {vetToToggle?.active ? 'Bloquearás' : 'Desbloquearás'} la cuenta del veterinario{" "}
              <strong>{vetToToggle?.name}</strong> (DNI: {vetToToggle?.dni}).
              {vetToToggle?.active 
                ? ' No podrá acceder al sistema una vez bloqueada la cuenta.' 
                : ' Podrá acceder al sistema nuevamente.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleConfirm}
              className={vetToToggle?.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              disabled={updateVetMutation.isPending}
            >
              {updateVetMutation.isPending ? 'Procesando...' : (vetToToggle?.active ? 'Bloquear Cuenta' : 'Desbloquear Cuenta')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}