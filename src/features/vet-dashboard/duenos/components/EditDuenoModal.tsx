"use client"

import { useState, useEffect, useCallback } from "react"
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
import { useUpdateDueno } from "../hooks/useDuenos"
import type { Dueno, UpdateDuenoRequest } from "../types"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  active: z.boolean(),
})

interface EditDuenoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dueno: Dueno
}

export default function EditDuenoModal({ open, onOpenChange, dueno }: EditDuenoModalProps) {
  const updateDuenoMutation = useUpdateDueno()
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      active: true,
    },
  })

  useEffect(() => {
    if (open && dueno) {
      form.reset({
        name: dueno.name,
        phone: dueno.phone,
        address: dueno.address,
        latitude: dueno.latitude,
        longitude: dueno.longitude,
        active: dueno.active,
      })
    }
  }, [open, dueno, form])

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
        title: "Confirmar actualización",
        message: `¿Estás seguro de actualizar la información de "${values.name}"?`,
        buttons: {
          cancel: "Revisar",
          confirm: "Sí, actualizar"
        }
      },
      handleSubmit
    )
  }, [form, showConfirmDialog])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    const payload: UpdateDuenoRequest = {
      name: values.name,
      phone: values.phone,
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
      active: values.active,
    }

    await updateDuenoMutation.mutateAsync({ id: dueno.id, data: payload })
    onOpenChange(false)
  }, [updateDuenoMutation, form, dueno.id, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-5xl h-auto max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl sm:text-2xl">Editar Dueño</DialogTitle>
            <DialogDescription>
              Modifica la información de {dueno.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Form {...form}>
              <form className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                  <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r">
                    <div className="space-y-4">
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

                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Usuario activo</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex flex-col min-h-[400px] lg:min-h-[500px]">
                    <div className="flex-1 p-4">
                      <SelectorMap
                        initialPosition={
                          dueno.latitude && dueno.longitude
                            ? { lat: dueno.latitude, lng: dueno.longitude }
                            : undefined
                        }
                        onPositionChange={handleMapPositionChange}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={updateDuenoMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              disabled={updateDuenoMutation.isPending}
              onClick={handleSubmitWithConfirmation}
            >
              {updateDuenoMutation.isPending ? "Guardando..." : "Guardar Cambios"}
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
          loading={updateDuenoMutation.isPending}
        />
      )}
    </>
  )
}
