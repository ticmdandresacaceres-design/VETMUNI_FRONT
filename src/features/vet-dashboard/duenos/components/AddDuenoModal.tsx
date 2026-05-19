"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import SelectorMap from "./SelectorMap"
import { useCreateDueno } from "../hooks/useDuenos"
import { CreateDuenoRequest } from "../types"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dni: z.string().min(6, "El DNI debe tener al menos 6 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

interface AddDuenoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddDuenoModal({ open, onOpenChange }: AddDuenoModalProps) {
  const createDuenoMutation = useCreateDueno()
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dni: "",
      email: "",
      phone: "",
      address: "",
    },
  })

  const handleMapPositionChange = (position: { lat: number; lng: number }) => {
    form.setValue('latitude', position.lat)
    form.setValue('longitude', position.lng)
  }

  const handleSubmitWithConfirmation = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()

    showConfirmDialog(
      {
        title: "Confirmar registro",
        message: `¿Estás seguro de crear el propietario "${values.name}" con DNI ${values.dni}?\n\nEsta acción creará una nueva cuenta de usuario.`,
        buttons: {
          cancel: "Revisar",
          confirm: "Sí, crear"
        }
      },
      handleSubmit
    )
  }, [form, showConfirmDialog])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    try {
      const payload: CreateDuenoRequest = {
        name: values.name,
        dni: values.dni,
        email: values.email,
        phone: values.phone,
        address: values.address,
        password: values.dni,
        latitude: values.latitude,
        longitude: values.longitude,
        active: true
      }

      await createDuenoMutation.mutateAsync(payload)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error handling is managed by the hook
    }
  }, [createDuenoMutation, form, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-5xl h-auto max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl sm:text-2xl">Agregar Nuevo Dueño</DialogTitle>
            <DialogDescription>
              Completa la información del propietario y selecciona su ubicación en el mapa.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Form {...form}>
              <form className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                  {/* Panel Izquierdo - Formulario (2/5 del ancho) */}
                  <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r">
                    <div className="space-y-4">
                      {/* Nombre */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* DNI y Teléfono en una fila */}
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="dni"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>DNI</FormLabel>
                              <FormControl>
                                <Input placeholder="12345678" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input placeholder="987 654 321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Correo */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="juan@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Dirección */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Av. Ejemplo 123, Distrito, Ciudad..."
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Panel Derecho - Mapa (3/5 del ancho) */}
                  <div className="lg:col-span-3 flex flex-col min-h-[400px] lg:min-h-[500px]">
                    <div className="flex-1 p-4">
                      <SelectorMap onPositionChange={handleMapPositionChange} />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createDuenoMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              disabled={createDuenoMutation.isPending}
              onClick={handleSubmitWithConfirmation}
            >
              {createDuenoMutation.isPending ? "Guardando..." : "Crear Dueño"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {options && (
        <ConfirmDialog
          open={isOpen}
          onOpenChange={hideConfirmDialog}
          title={options.title}
          message={options.message}
          buttons={options.buttons}
          onConfirm={handleConfirm}
          loading={createDuenoMutation.isPending}
        />
      )}
    </>
  )
}