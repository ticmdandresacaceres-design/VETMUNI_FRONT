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
import { useUpdateMascota } from "../hooks/usePacientes"
import type { Mascota, UpdateMascotaRequest } from "../types"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.string().min(1, "La especie es requerida"),
  race: z.string().min(1, "La raza es requerida"),
  gender: z.string().min(1, "El género es requerido"),
  temperament: z.string().min(1, "El temperamento es requerido"),
  reproductive_condition: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
  years: z.number().min(0, "Los años deben ser 0 o mayor"),
  months: z.number().min(0).max(11, "Los meses deben ser entre 0 y 11"),
  status: z.string().min(1, "El estado es requerido"),
})

interface EditMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mascota: Mascota
}

const speciesOptions = ["Perro", "Gato", "Ave", "Conejo", "Hamster", "Pez", "Reptil", "Otro"]
const genderOptions = ["MACHO", "HEMBRA"]
const temperamentOptions = ["Tranquilo", "Activo", "Agresivo", "Tímido", "Sociable", "Juguetón"]
const reproductiveConditionOptions = ["ENTERO", "CASTRADO"]
const statusOptions = ["ADOPTADO", "EN ADOPCIÓN"]

export default function EditMascotaModal({ open, onOpenChange, mascota }: EditMascotaModalProps) {
  const updateMascotaMutation = useUpdateMascota()
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  function parseAge(age: string): { years: number; months: number } {
    const yearsMatch = age.match(/(\d+)\s*año/);
    const monthsMatch = age.match(/(\d+)\s*mes/);
    return {
      years: yearsMatch ? parseInt(yearsMatch[1]) : 0,
      months: monthsMatch ? parseInt(monthsMatch[1]) : 0,
    };
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      race: "",
      gender: "",
      temperament: "",
      reproductive_condition: "",
      color: "",
      years: 0,
      months: 0,
      status: "ADOPTADO",
    },
  })

  useEffect(() => {
    if (open && mascota) {
      const { years, months } = parseAge(mascota.age);
      form.reset({
        name: mascota.name,
        species: mascota.species,
        race: mascota.race,
        gender: mascota.gender,
        temperament: mascota.temperament,
        reproductive_condition: mascota.reproductive_condition,
        color: mascota.color ?? "",
        years,
        months,
        status: mascota.status,
      })
    }
  }, [open, mascota, form])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    const payload: UpdateMascotaRequest = {
      name: values.name,
      species: values.species,
      race: values.race,
      gender: values.gender,
      temperament: values.temperament,
      reproductive_condition: values.reproductive_condition,
      color: values.color,
      years: values.years,
      months: values.months,
      status: values.status,
    }

    await updateMascotaMutation.mutateAsync({ id: mascota.id, data: payload })
    form.reset()
    onOpenChange(false)
  }, [updateMascotaMutation, form, mascota.id, onOpenChange])

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
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">Editar Mascota</DialogTitle>
            <DialogDescription>
              Modifica la información de {mascota.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Firulais" {...field} />
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
                              <SelectValue placeholder="Seleccionar especie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {speciesOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="race"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raza</FormLabel>
                        <FormControl>
                          <Input placeholder="Labrador" {...field} />
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
                          <Input placeholder="Marrón" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar género" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="temperament"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar temperamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {temperamentOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="reproductive_condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condición Reproductiva</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar condición" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reproductiveConditionOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Años</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
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
                        <FormLabel>Meses</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={11} placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>

          <DialogFooter className="px-6 py-4 border-t gap-2 sm:gap-0">
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
