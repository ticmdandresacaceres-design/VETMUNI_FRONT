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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmDialog } from "@/src/shared/components/ConfirmDialog"
import { useConfirmDialog } from "@/src/shared/hooks/useConfirmDialog"
import { useCreateMascota } from "../hooks/useMascotas"
import { CreateMascotaRequest } from "../types"
import SelectDueno from "./SelectDueno"
import apiClient from "@/src/lib/api/axios"

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.string().min(1, "La especie es requerida"),
  speciesOther: z.string().optional(),
  race: z.string().min(1, "La raza es requerida"),
  years: z.number().min(0, "Los años deben ser 0 o mayor").max(50, "Los años no pueden ser mayor a 50"),
  months: z.number().min(0, "Los meses deben ser 0 o mayor").max(11, "Los meses no pueden ser mayor a 11"),
  gender: z.string().min(1, "El sexo es requerido"),
  temperament: z.string().min(1, "El temperamento es requerido"),
  reproductive_condition: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
  user_id: z.string().min(1, "Debe seleccionar un dueño"),
})

interface AddMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddMascotaModal({ open, onOpenChange }: AddMascotaModalProps) {
  const createMascotaMutation = useCreateMascota()
  const [speciesSelected, setSpeciesSelected] = useState("")
  const { isOpen, options, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      speciesOther: "",
      race: "",
      years: 0,
      months: 0,
      gender: "",
      temperament: "",
      reproductive_condition: "",
      color: "",
      user_id: "",
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setSpeciesSelected("")
    }
  }, [open, form])

  const getDuenoNombre = async () => {
    const userId = form.getValues("user_id")
    if (!userId) return "el propietario seleccionado"
    
    try {
      const response = await apiClient.get(`/users/${userId}`)
      return response.data?.data?.name || "el propietario seleccionado"
    } catch {
      return "el propietario seleccionado"
    }
  }

  const handleSubmitWithConfirmation = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    const values = form.getValues()
    const finalSpecies = values.species === "Otro" ? values.speciesOther : values.species
    const duenoNombre = await getDuenoNombre()
    
    const ageText = values.years > 0 || values.months > 0 
      ? `${values.years} año${values.years !== 1 ? 's' : ''} y ${values.months} mes${values.months !== 1 ? 'es' : ''}`
      : "menos de 1 mes"

    showConfirmDialog(
      {
        title: "Confirmar registro",
        message: `¿Estás seguro de registrar a "${values.name}"?\n\nEspecie: ${finalSpecies}\nEdad: ${ageText}\nPropietario: ${duenoNombre}`,
        buttons: {
          cancel: "Revisar",
          confirm: "Sí, registrar"
        }
      },
      handleSubmit
    )
  }, [form, showConfirmDialog])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    try {
      const payload: CreateMascotaRequest = {
        name: values.name,
        species: values.species === "Otro" ? values.speciesOther || "" : values.species,
        race: values.race,
        years: values.years,
        months: values.months,
        gender: values.gender,
        temperament: values.temperament,
        reproductive_condition: values.reproductive_condition,
        color: values.color,
        user_id: values.user_id,
        status: "Activo"
      }

      await createMascotaMutation.mutateAsync(payload)
      form.reset()
      setSpeciesSelected("")
      onOpenChange(false)
    } catch (error) {
      // Handled by hook
    }
  }, [createMascotaMutation, form, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl">Agregar Nueva Mascota</DialogTitle>
            <DialogDescription>
              Completa la información de la mascota y asigna su propietario.
            </DialogDescription>
          </DialogHeader>

          {/* Content scrolleable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Form {...form}>
              <div className="space-y-6">
                {/* Sección: Propietario (primero y destacado) */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Propietario</FormLabel>
                        <FormControl>
                          <SelectDueno
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Buscar propietario por nombre o DNI"
                            disabled={createMascotaMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección: Identificación */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Identificación</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSpeciesSelected(value)
                              if (value !== "Otro") form.setValue("speciesOther", "")
                            }} 
                            value={field.value}
                          >
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

                    {speciesSelected === "Otro" && (
                      <FormField
                        control={form.control}
                        name="speciesOther"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Especifica la especie</FormLabel>
                            <FormControl>
                              <Input placeholder="Escribe la especie..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="race"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raza</FormLabel>
                          <FormControl>
                            <Input placeholder="Labrador, Siamés..." {...field} />
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
                  </div>
                </div>

                {/* Sección: Edad y Características */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Edad y Características</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="years"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Años</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="50" 
                              placeholder="0"
                              {...field}
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
                          <FormLabel>Meses</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="11" 
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
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
                          <FormLabel>Sexo</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sexo" />
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
                      name="reproductive_condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condición</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Condición" />
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

                  <FormField
                    control={form.control}
                    name="temperament"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona temperamento" />
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
                </div>
              </div>
            </Form>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createMascotaMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              disabled={createMascotaMutation.isPending}
              onClick={handleSubmitWithConfirmation}
            >
              {createMascotaMutation.isPending ? "Guardando..." : "Crear Mascota"}
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
          loading={createMascotaMutation.isPending}
        />
      )}
    </>
  )
}