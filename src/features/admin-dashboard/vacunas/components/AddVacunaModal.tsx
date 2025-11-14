"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Syringe } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useVacunaContext } from "../context/VacunaContext"
import { VacunaNewRequest } from "../types"
import SelectMascota from "./SelectMascota"

const formSchema = z.object({
  tipo: z.string().min(1, "El tipo de vacuna es requerido"),
  tipoPersonalizado: z.string().optional(),
  fechaAplicacion: z.string().min(1, "La fecha de aplicación es requerida"),
  mascotaId: z.string().min(1, "Debe seleccionar una mascota"),
  mesesVigencia: z.number().min(1, "Los meses de vigencia son requeridos").max(60, "Máximo 60 meses"),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es requerida"),
  proximaDosis: z.string().min(1, "La fecha de próxima dosis es requerida"),
}).refine((data) => {
  if (data.tipo === "Otra") {
    return data.tipoPersonalizado && data.tipoPersonalizado.trim().length > 0
  }
  return true
}, {
  message: "Debe especificar el tipo de vacuna personalizado",
  path: ["tipoPersonalizado"]
})

interface AddVacunaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddVacunaModal({ open, onOpenChange }: AddVacunaModalProps) {
  const { createVacuna, loading } = useVacunaContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getFechaActual = useCallback(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  // Función para convertir fecha string a Date evitando problemas de timezone
  const stringToDate = useCallback((dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }, [])

  // Función para convertir Date a string YYYY-MM-DD
  const dateToString = useCallback((date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      tipoPersonalizado: "",
      fechaAplicacion: getFechaActual(),
      mascotaId: "",
      mesesVigencia: 12,
      fechaVencimiento: "",
      proximaDosis: "",
    },
  })

  // CORREGIDO: Calcular fecha de vencimiento automáticamente
  const calcularFechaVencimiento = useCallback((fechaAplicacion: string, mesesVigencia: number) => {
    if (!fechaAplicacion || !mesesVigencia) return ""
    
    const fecha = stringToDate(fechaAplicacion)
    fecha.setMonth(fecha.getMonth() + mesesVigencia)
    return dateToString(fecha)
  }, [stringToDate, dateToString])

  // CORREGIDO: Calcular próxima dosis (30 días antes del vencimiento)
  const calcularProximaDosis = useCallback((fechaVencimiento: string) => {
    if (!fechaVencimiento) return ""
    
    const fecha = stringToDate(fechaVencimiento)
    fecha.setDate(fecha.getDate() - 30)
    return dateToString(fecha)
  }, [stringToDate, dateToString])

  // NUEVO: Función combinada para actualizar ambas fechas
  const actualizarFechas = useCallback((fechaAplicacion: string, mesesVigencia: number) => {
    if (fechaAplicacion && mesesVigencia) {
      const fechaVencimiento = calcularFechaVencimiento(fechaAplicacion, mesesVigencia)
      form.setValue("fechaVencimiento", fechaVencimiento)
      
      if (fechaVencimiento) {
        const proximaDosis = calcularProximaDosis(fechaVencimiento)
        form.setValue("proximaDosis", proximaDosis)
      }
    }
  }, [form, calcularFechaVencimiento, calcularProximaDosis])

  // Inicializar fechas cuando se abre el modal
  useEffect(() => {
    if (open) {
      const fechaActual = getFechaActual()
      form.setValue("fechaAplicacion", fechaActual)
      form.setValue("mesesVigencia", 12)
      
      // Calcular fechas automáticas con valores por defecto
      actualizarFechas(fechaActual, 12)
    } else {
      const fechaActual = getFechaActual()
      form.reset({
        tipo: "",
        tipoPersonalizado: "",
        fechaAplicacion: fechaActual,
        mascotaId: "",
        mesesVigencia: 12,
        fechaVencimiento: "",
        proximaDosis: "",
      })
    }
  }, [open, form, getFechaActual, actualizarFechas])

  // CORREGIDO: Watcher para fechas automáticas
  const fechaAplicacion = form.watch("fechaAplicacion")
  const mesesVigencia = form.watch("mesesVigencia")
  
  useEffect(() => {
    if (fechaAplicacion && mesesVigencia && mesesVigencia > 0) {
      actualizarFechas(fechaAplicacion, mesesVigencia)
    }
  }, [fechaAplicacion, mesesVigencia, actualizarFechas])

  // Watch para detectar cuando se selecciona "Otra"
  const tipoSeleccionado = form.watch("tipo")

  const handleSubmit = useCallback(async () => {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      const payload: VacunaNewRequest = {
        tipo: values.tipo === "Otra" ? values.tipoPersonalizado || "" : values.tipo,
        fechaAplicacion: values.fechaAplicacion,
        mascotaId: values.mascotaId,
        mesesVigencia: values.mesesVigencia,
        fechaVencimiento: values.fechaVencimiento,
        proximaDosis: values.proximaDosis,
      }

      const success = await createVacuna(payload)
      if (success) {
        const fechaActual = getFechaActual()
        form.reset({
          tipo: "",
          tipoPersonalizado: "",
          fechaAplicacion: fechaActual,
          mascotaId: "",
          mesesVigencia: 12,
          fechaVencimiento: "",
          proximaDosis: "",
        })
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [createVacuna, form, onOpenChange, getFechaActual])

  const tiposVacuna = [
    "Antirrábica",
    "Parvovirus", 
    "Moquillo",
    "Hepatitis",
    "Parainfluenza",
    "Bordetella",
    "Leptospirosis",
    "Triple Felina",
    "Leucemia Felina",
    "Polivalente",
    "Otra"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Registrar Nueva Vacuna
          </DialogTitle>
          <DialogDescription>
            Registra la aplicación de una vacuna y programa las siguientes dosis.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            {/* Información de la Vacuna */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vacuna</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      // Limpiar el campo personalizado si no es "Otra"
                      if (value !== "Otra") {
                        form.setValue("tipoPersonalizado", "")
                      }
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposVacuna.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Input condicional para tipo personalizado */}
              {tipoSeleccionado === "Otra" && (
                <FormField
                  control={form.control}
                  name="tipoPersonalizado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especificar Tipo de Vacuna</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escriba el tipo de vacuna"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Solo mostrar selector de mascota si no se seleccionó "Otra" */}
              {tipoSeleccionado !== "Otra" && (
                <FormField
                  control={form.control}
                  name="mascotaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mascota</FormLabel>
                      <FormControl>
                        <SelectMascota
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Buscar mascota"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Selector de mascota en fila separada cuando se selecciona "Otra" */}
            {tipoSeleccionado === "Otra" && (
              <FormField
                control={form.control}
                name="mascotaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mascota</FormLabel>
                    <FormControl>
                      <SelectMascota
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Buscar mascota"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator className="my-4" />

            {/* Fechas y Vigencia */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaAplicacion"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Aplicación</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(stringToDate(field.value), "PPP", { locale: es })
                            ) : (
                              <span>Selecciona fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? stringToDate(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(dateToString(date))
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          defaultMonth={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mesesVigencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meses de Vigencia</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="12"
                        min={1}
                        max={60}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fechas Calculadas */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaVencimiento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="text-muted-foreground"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proximaDosis"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Próxima Dosis (Recordatorio)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="text-muted-foreground"
                        readOnly
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
            {isSubmitting ? "Registrando..." : "Registrar Vacuna"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}