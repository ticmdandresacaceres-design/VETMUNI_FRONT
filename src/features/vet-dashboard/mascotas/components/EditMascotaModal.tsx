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
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import { useUpdateMascota } from "../hooks/useMascotas"
import type { Mascota, UpdateMascotaRequest } from "../types"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.string().min(1, "La especie es requerida"),
  race: z.string().min(1, "La raza es requerida"),
  years: z.number().min(0, "Los años no pueden ser negativos"),
  months: z.number().min(0, "Los meses no pueden ser negativos").max(11, "Los meses no pueden ser mayores a 11"),
  gender: z.string().min(1, "El sexo es requerido"),
  temperament: z.string().min(1, "El temperamento es requerido"),
  reproductive_condition: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
  status: z.string().min(1, "El estado es requerido"),
})

interface EditMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mascota: Mascota
}

export default function EditMascotaModal({ open, onOpenChange, mascota }: EditMascotaModalProps) {
  const updateMascotaMutation = useUpdateMascota()
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      race: "",
      years: 0,
      months: 0,
      gender: "",
      temperament: "",
      reproductive_condition: "",
      color: "",
      status: "Activo",
    },
  })

  useEffect(() => {
    if (open && mascota) {
      form.reset({
        name: mascota.name,
        species: mascota.species,
        race: mascota.race,
        years: mascota.years,
        months: mascota.months,
        gender: mascota.gender,
        temperament: mascota.temperament,
        reproductive_condition: mascota.reproductive_condition,
        color: mascota.color,
        status: mascota.status,
      })
    }
  }, [open, mascota, form])

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
    const payload: UpdateMascotaRequest = {
      name: values.name,
      species: values.species,
      race: values.race,
      years: values.years,
      months: values.months,
      gender: values.gender,
      temperament: values.temperament,
      reproductive_condition: values.reproductive_condition,
      color: values.color,
      status: values.status,
    }

    await updateMascotaMutation.mutateAsync({ id: mascota.id, data: payload })
    onOpenChange(false)
  }, [updateMascotaMutation, form, mascota.id, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Mascota</DialogTitle>
            <DialogDescription>
              Modifica la información de {mascota.name}.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Básica</h3>

                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Max, Luna..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especie</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Perro">Perro</SelectItem>
                            <SelectItem value="Gato">Gato</SelectItem>
                            <SelectItem value="Ave">Ave</SelectItem>
                            <SelectItem value="Conejo">Conejo</SelectItem>
                            <SelectItem value="Hamster">Hamster</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MACHO">Macho</SelectItem>
                            <SelectItem value="HEMBRA">Hembra</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="race"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raza</FormLabel>
                        <FormControl>
                          <Input placeholder="Labrador..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Negro, Blanco..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Años</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meses (0-11)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="6"
                            min="0"
                            max="11"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comportamiento y Estado Reproductivo</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperament"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Dócil">Dócil</SelectItem>
                            <SelectItem value="Agresivo">Agresivo</SelectItem>
                            <SelectItem value="Juguetón">Juguetón</SelectItem>
                            <SelectItem value="Tímido">Tímido</SelectItem>
                            <SelectItem value="Protector">Protector</SelectItem>
                            <SelectItem value="Calmado">Calmado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reproductive_condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condición Reproductiva</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Entero">Entero</SelectItem>
                            <SelectItem value="Castrado">Castrado</SelectItem>
                            <SelectItem value="Esterilizado">Esterilizado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </Form>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMascotaMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={updateMascotaMutation.isPending}
              onClick={handleSubmitWithConfirmation}
            >
              {updateMascotaMutation.isPending ? "Guardando..." : "Guardar Cambios"}
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
          loading={updateMascotaMutation.isPending}
        />
      )}
    </>
  )
}
