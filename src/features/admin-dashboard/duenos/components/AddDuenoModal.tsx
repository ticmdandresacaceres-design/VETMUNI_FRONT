"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SelectorMap from "./SelectorMap"
import { useDuenoContext } from "../context/DuenoContext"
import { DuenoNewRequest } from "../types"

// Esquema de validación con Zod
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  DNI: z.string().min(1, "El DNI es requerido"),
  correo: z.string().email("Email inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
})

interface AddDuenoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddDuenoModal({ open, onOpenChange }: AddDuenoModalProps) {
  const { createDueno, loading } = useDuenoContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configuración del formulario con React Hook Form y Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      DNI: "",
      correo: "",
      telefono: "",
      direccion: "",
      password: "",
      latitud: "",
      longitud: "",
    },
  })

  const handleMapPositionChange = (position: { lat: number; lng: number }) => {
    form.setValue('latitud', position.lat.toString())
    form.setValue('longitud', position.lng.toString())
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const payload: DuenoNewRequest = {
        nombre: values.nombre,
        DNI: values.DNI,
        correo: values.correo,
        telefono: values.telefono,
        direccion: values.direccion,
        password: values.password,
        latitud: values.latitud || "",
        longitud: values.longitud || "",
      }

      const success = await createDueno(payload)
      if (success) {
        form.reset()
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-none w-[95vw] h-[95vh] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] flex flex-col overflow-hidden"
        style={{ 
          width: '95vw', 
          maxWidth: '1600px', 
          height: '95vh',
          minHeight: '600px'
        }}
      >
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Agregar Nuevo Dueño</DialogTitle>
          <DialogDescription className="text-gray-600">
            Completa toda la información del propietario de la mascota incluyendo su ubicación.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              {/* Layout para pantallas grandes */}
              <div className="hidden xl:block h-full">
                <div className="grid grid-cols-5 gap-6 h-full">
                  {/* Columna izquierda - Información Personal (2 columnas) */}
                  <div className="col-span-2 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-600 mb-3">Información Personal</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Nombre Completo</FormLabel>
                                <FormControl>
                                  <Input placeholder="Juan Pérez" className="h-9" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="DNI"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">DNI</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345678" className="h-9" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="correo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Correo Electrónico</FormLabel>
                                <FormControl>
                                  <Input placeholder="juan@example.com" type="email" className="h-9" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="telefono"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Teléfono</FormLabel>
                                <FormControl>
                                  <Input placeholder="+51 987 654 321" className="h-9" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Contraseña</FormLabel>
                              <FormControl>
                                <Input placeholder="••••••••" type="password" className="h-9" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="direccion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Dirección</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Av. Ejemplo 123, Distrito, Ciudad..."
                                  className="min-h-[70px] max-h-[70px] resize-none text-sm"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator className="my-3" />

                        {/* Coordenadas */}
                        <div>
                          <h4 className="text-md font-medium text-gray-600 mb-2">Coordenadas</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name="latitud"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Latitud</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="-13.162479" 
                                      {...field} 
                                      readOnly 
                                      className="h-9 text-sm"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="longitud"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Longitud</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="-74.213383" 
                                      {...field} 
                                      readOnly 
                                      className="h-9 text-sm"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha - Mapa (3 columnas) */}
                  <div className="col-span-3">
                    <div className="h-full">
                      <h3 className="text-lg font-medium text-gray-600 mb-3">Ubicación en el Mapa</h3>
                      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 h-[calc(100%-2rem)]">
                        <SelectorMap
                          onPositionChange={handleMapPositionChange}
                          height="100%"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout para pantallas medianas y pequeñas usando Tabs */}
              <div className="block xl:hidden h-full">
                <Tabs defaultValue="info" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="info">Información Personal</TabsTrigger>
                    <TabsTrigger value="location">Ubicación</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="flex-1 space-y-4 mt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="nombre"
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
                          name="DNI"
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="correo"
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
                          name="telefono"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input placeholder="+51 987 654 321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input placeholder="••••••••" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Av. Ejemplo 123, Distrito, Ciudad..."
                                className="min-h-[100px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      {/* Coordenadas en móvil */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Coordenadas</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="latitud"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Latitud</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="-13.162479" 
                                    {...field} 
                                    readOnly 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="longitud"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Longitud</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="-74.213383" 
                                    {...field} 
                                    readOnly 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="flex-1 mt-0">
                    <div className="h-full">
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-full">
                        <SelectorMap
                          onPositionChange={handleMapPositionChange}
                          height="100%"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <Separator className="my-4" />

            <DialogFooter className="shrink-0 flex flex-col sm:flex-row justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="px-6 h-9 w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || loading}
                className="px-6 h-9 w-full sm:w-auto"
              >
                {isSubmitting ? "Guardando..." : "Crear Dueño"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}