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
import { useCreateDueno } from "../hooks/useDuenos"
import { CreateDuenoRequest } from "../types"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos numéricos"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
})

const DEFAULT_LAT = -13.162349554460294;
const DEFAULT_LNG = -74.21340682262704;

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
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        active: true
      }

      await createDuenoMutation.mutateAsync(payload)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al crear dueño:", error);
    }
  }, [createDuenoMutation, form, onOpenChange])

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
  }, [form, showConfirmDialog, handleSubmit])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Agregar Nuevo Dueño</DialogTitle>
            <DialogDescription>
              Completa la información del propietario.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4 py-2">
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
            </form>
          </Form>

          <DialogFooter className="gap-2">
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
