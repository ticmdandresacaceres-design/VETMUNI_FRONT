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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import { useUpdateVacuna } from "../hooks/useVacunas"
import type { Vacuna, UpdateVacunaRequest } from "../types"

const formSchema = z.object({
  type: z.string().min(1, "El tipo de vacuna es requerido"),
  aplication_date: z.string().min(1, "La fecha de aplicación es requerida"),
  months_validity: z.number().min(1, "La vigencia debe ser al menos 1 mes"),
})

interface EditVacunaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacuna: Vacuna
}

const vacunaTypes = [
  "Rabia",
  "Séxtuple",
  "Quíntuple",
  "Triple Felina",
  "Cuádruple Felina",
  "Leptospirosis",
  "Bordetella",
  "Giardia",
  "Parvovirus",
  "Moquillo",
  "Otra",
]

export default function EditVacunaModal({ open, onOpenChange, vacuna }: EditVacunaModalProps) {
  const updateVacunaMutation = useUpdateVacuna()
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      aplication_date: "",
      months_validity: 12,
    },
  })

  useEffect(() => {
    if (open && vacuna) {
      const dateStr = vacuna.aplication_date.includes("T")
        ? vacuna.aplication_date.split("T")[0]
        : vacuna.aplication_date
      form.reset({
        type: vacuna.type,
        aplication_date: dateStr,
        months_validity: vacuna.months_validity,
      })
    }
  }, [open, vacuna, form])

  const handleSubmitWithConfirmation = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()

    showConfirmDialog(
      {
        title: "Confirmar actualización",
        message: `¿Estás seguro de actualizar la vacuna "${values.type}"?`,
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
    const payload: UpdateVacunaRequest = {
      type: values.type,
      aplication_date: values.aplication_date,
      months_validity: values.months_validity,
    }

    await updateVacunaMutation.mutateAsync({ id: vacuna.id, data: payload })
    form.reset()
    onOpenChange(false)
  }, [updateVacunaMutation, form, vacuna.id, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">Editar Vacuna</DialogTitle>
            <DialogDescription>
              Modifica la información de la vacuna {vacuna.type}.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Vacuna</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar vacuna" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vacunaTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aplication_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Aplicación</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="months_validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vigencia (meses)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="12"
                          value={field.value}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <DialogFooter className="px-6 py-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateVacunaMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={updateVacunaMutation.isPending}
              onClick={handleSubmitWithConfirmation}
            >
              {updateVacunaMutation.isPending ? "Guardando..." : "Guardar Cambios"}
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
          loading={updateVacunaMutation.isPending}
        />
      )}
    </>
  )
}
