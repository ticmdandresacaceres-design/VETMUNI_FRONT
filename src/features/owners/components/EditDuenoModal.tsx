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
import { useUpdateDueno } from "../hooks/useDuenos"
import type { Dueno, UpdateDuenoRequest } from "../types"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
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
      active: true,
    },
  })

  useEffect(() => {
    if (open && dueno) {
      form.reset({
        name: dueno.name,
        phone: dueno.phone ?? "",
        address: dueno.address,
        active: dueno.active,
      })
    }
  }, [open, dueno, form])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    const payload: UpdateDuenoRequest = {
      name: values.name,
      phone: values.phone,
      address: values.address,
      active: values.active,
    }

    await updateDuenoMutation.mutateAsync({ id: dueno.id, data: payload })
    form.reset()
    onOpenChange(false)
  }, [updateDuenoMutation, form, dueno.id, onOpenChange])

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
  }, [form, showConfirmDialog, handleSubmit])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Dueño</DialogTitle>
            <DialogDescription>
              Modifica la información de {dueno.name}.
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
            </form>
          </Form>

          <DialogFooter className="gap-2">
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
