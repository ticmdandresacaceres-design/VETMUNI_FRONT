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
import { Separator } from "@/components/ui/separator"
import { useMascotaContext } from "../context/MascotaContext"
import { MascotaNewRequest } from "../types"
import SelectDueno from "./SelectDueno"

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  especie: z.string().min(1, "La especie es requerida"),
  especieOtra: z.string().optional(),
  raza: z.string().min(1, "La raza es requerida"),
  anios: z.number().min(0, "Los años deben ser 0 o mayor").max(50, "Los años no pueden ser mayor a 50"),
  meses: z.number().min(0, "Los meses deben ser 0 o mayor").max(11, "Los meses no pueden ser mayor a 11"),
  sexo: z.string().min(1, "El sexo es requerido"),
  temperamento: z.string().min(1, "El temperamento es requerido"),
  condicionReproductiva: z.string().min(1, "La condición reproductiva es requerida"),
  color: z.string().min(1, "El color es requerido"),
  duenoId: z.string().min(1, "Debe seleccionar un dueño"),
})

interface AddMascotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddMascotaModal({ open, onOpenChange }: AddMascotaModalProps) {
  const { createMascota, loading } = useMascotaContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [especieSeleccionada, setEspecieSeleccionada] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      especie: "",
      especieOtra: "",
      raza: "",
      anios: 0,
      meses: 0,
      sexo: "",
      temperamento: "",
      condicionReproductiva: "",
      color: "",
      duenoId: "",
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setEspecieSeleccionada("")
    }
  }, [open, form])

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      const payload: MascotaNewRequest = {
        nombre: values.nombre,
        especie: values.especie === "Otro" ? values.especieOtra || "" : values.especie,
        raza: values.raza,
        anios: values.anios,
        meses: values.meses,
        sexo: values.sexo,
        temperamento: values.temperamento,
        condicionReproductiva: values.condicionReproductiva,
        color: values.color,
        duenoId: values.duenoId,
      }

      const success = await createMascota(payload)
      if (success) {
        form.reset()
        setEspecieSeleccionada("")
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [createMascota, form, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Mascota</DialogTitle>
          <DialogDescription>
            Completa la información de la mascota y asigna su propietario.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            {/* Información General - 2 columnas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
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
                name="especie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especie</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value)
                        setEspecieSeleccionada(value)
                        if (value !== "Otro") {
                          form.setValue("especieOtra", "")
                        }
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona especie" />
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

              {/* Input para especie "Otro" */}
              {especieSeleccionada === "Otro" && (
                <FormField
                  control={form.control}
                  name="especieOtra"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                name="raza"
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

              {/* Edad dividida en años y meses */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="anios"
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
                  name="meses"
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
              </div>
            </div>

            <Separator className="my-4" />

            {/* Características Físicas - 3 columnas */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sexo"
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
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Hembra">Hembra</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="temperamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Temperamento" />
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

            <Separator className="my-4" />

            {/* Información Adicional - Full width */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condicionReproductiva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condición Reproductiva</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona condición" />
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

              <FormField
                control={form.control}
                name="duenoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propietario</FormLabel>
                    <FormControl>
                      <SelectDueno
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Buscar propietario por nombre o DNI"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            className="mx-1"
            type="button" 
            disabled={isSubmitting || loading}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isSubmitting ? "Guardando..." : "Crear Mascota"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}