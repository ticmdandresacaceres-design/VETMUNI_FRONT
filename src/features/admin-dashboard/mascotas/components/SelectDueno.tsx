"use client"

import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, Search, User } from "lucide-react"
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
import { useDuenoContext } from "../../duenos/context/DuenoContext"
import { DuenoDetails } from "../../duenos/types"

interface SelectDuenoProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const MAX_RESULTS = 5

function SelectDueno({ 
  value, 
  onValueChange, 
  placeholder = "Buscar propietario...",
  disabled = false 
}: SelectDuenoProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { duenos, getDuenoById, searchDuenos, loading } = useDuenoContext()
  const [selectedDueno, setSelectedDueno] = useState<DuenoDetails | null>(null)

  // CORREGIDO: Cargar el dueño seleccionado cuando value cambie
  useEffect(() => {
    if (value) {
      // Si el value cambió o no tenemos el dueño cargado, cargarlo
      if (!selectedDueno || selectedDueno.id !== value) {
        getDuenoById(value).then((dueno) => {
          if (dueno) {
            setSelectedDueno(dueno)
          } else {
            setSelectedDueno(null)
          }
        })
      }
    } else {
      setSelectedDueno(null)
    }
  }, [value, getDuenoById]) // Removido selectedDueno de las dependencias

  // Buscar dueños solo cuando el usuario escribe
  useEffect(() => {
    if (!open) return 
    
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) { 
        searchDuenos(searchTerm)
      }
    }, 300) 

    return () => clearTimeout(timeoutId)
  }, [searchTerm, searchDuenos, open])

  // Limitar resultados a máximo 5
  const limitedDuenos = useMemo(() => {
    return duenos.slice(0, MAX_RESULTS)
  }, [duenos])

  const handleSelect = (duenoId: string) => {
    onValueChange(duenoId)
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
          {selectedDueno ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {selectedDueno.nombre} - {selectedDueno.DNI}
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
            placeholder="Buscar por nombre o DNI (mín. 2 caracteres)..."
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
              <CommandEmpty>Buscando propietarios...</CommandEmpty>
            ) : limitedDuenos.length === 0 ? (
              <CommandEmpty>
                No se encontraron propietarios con "{searchTerm}"
              </CommandEmpty>
            ) : (
              <CommandGroup>
                <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                  {limitedDuenos.length === MAX_RESULTS ? 
                    `Mostrando los primeros ${MAX_RESULTS} resultados` : 
                    `${limitedDuenos.length} resultado${limitedDuenos.length !== 1 ? 's' : ''}`
                  }
                </div>
                {limitedDuenos.map((dueno) => (
                  <CommandItem
                    key={dueno.id}
                    value={dueno.id}
                    onSelect={() => handleSelect(dueno.id)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{dueno.nombre}</span>
                      <span className="text-sm text-muted-foreground">
                        DNI: {dueno.DNI} • Tel: {dueno.telefono}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === dueno.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                {limitedDuenos.length === MAX_RESULTS && (
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

export default SelectDueno