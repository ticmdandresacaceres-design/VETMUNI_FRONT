"use client"

import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, Search, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMascotaContext } from "../../mascotas/context/MascotaContext"
import { MascotaDetails } from "../../mascotas/types"

interface SelectMascotaProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const MAX_RESULTS = 5

function SelectMascota({ 
  value, 
  onValueChange, 
  placeholder = "Buscar mascota...",
  disabled = false 
}: SelectMascotaProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { mascotas, getMascotaById, searchMascotas, loading } = useMascotaContext()
  const [selectedMascota, setSelectedMascota] = useState<MascotaDetails | null>(null)

  // CORREGIDO: Cargar la mascota seleccionada cuando value cambie
  useEffect(() => {
    if (value) {
      // Si el value cambió o no tenemos la mascota cargada, cargarla
      if (!selectedMascota || selectedMascota.id !== value) {
        getMascotaById(value).then((mascota) => {
          if (mascota) {
            setSelectedMascota(mascota)
          } else {
            setSelectedMascota(null)
          }
        })
      }
    } else {
      setSelectedMascota(null)
    }
  }, [value, getMascotaById]) // Removido selectedMascota de las dependencias

  // Buscar mascotas solo cuando el usuario escribe
  useEffect(() => {
    if (!open) return 
    
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) { 
        searchMascotas(searchTerm)
      }
    }, 300) 

    return () => clearTimeout(timeoutId)
  }, [searchTerm, searchMascotas, open])

  // Limitar resultados a máximo 5
  const limitedMascotas = useMemo(() => {
    return mascotas.slice(0, MAX_RESULTS)
  }, [mascotas])

  const handleSelect = (mascotaId: string) => {
    onValueChange(mascotaId)
    setOpen(false)
    setSearchTerm("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchTerm("")
    }
  }

  const showResults = searchTerm.trim().length >= 2
  const showMinimumMessage = searchTerm.trim().length > 0 && searchTerm.trim().length < 2

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedMascota ? (
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {selectedMascota.nombre} ({selectedMascota.especie})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>{placeholder}</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por nombre o propietario (mín. 2 caracteres)..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            {!showResults && !showMinimumMessage ? (
              <CommandEmpty>Escribe al menos 2 caracteres</CommandEmpty>
            ) : showMinimumMessage ? (
              <CommandEmpty>Escribe al menos 2 caracteres</CommandEmpty>
            ) : loading ? (
              <CommandEmpty>Buscando mascotas...</CommandEmpty>
            ) : limitedMascotas.length === 0 ? (
              <CommandEmpty>
                No se encontraron mascotas con "{searchTerm}"
              </CommandEmpty>
            ) : (
              <CommandGroup>
                <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                  {limitedMascotas.length === MAX_RESULTS ? 
                    `Mostrando las primeras ${MAX_RESULTS} mascotas` : 
                    `${limitedMascotas.length} mascota${limitedMascotas.length !== 1 ? 's' : ''}`
                  }
                </div>
                {limitedMascotas.map((mascota) => (
                  <CommandItem
                    key={mascota.id}
                    value={mascota.id}
                    onSelect={() => handleSelect(mascota.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{mascota.nombre}</span>
                      <span className="text-sm text-muted-foreground">
                        {mascota.especie} • {mascota.raza} • Propietario: {mascota.dueno}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === mascota.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                {limitedMascotas.length === MAX_RESULTS && (
                  <div className="px-2 py-2 text-xs text-muted-foreground text-center border-t bg-muted/30">
                    Refina tu búsqueda para ver más resultados específicos
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SelectMascota