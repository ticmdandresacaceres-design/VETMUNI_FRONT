"use client"

import { useState, useMemo } from "react"
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
import { useMascotas } from "../../mascotas/hooks/useMascotas"

interface SelectMascotaProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const MAX_RESULTS = 10

function SelectMascota({ 
  value, 
  onValueChange, 
  placeholder = "Buscar mascota...",
  disabled = false 
}: SelectMascotaProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { data: mascotas, isLoading: loading } = useMascotas()

  const selectedMascota = useMemo(() => {
    return mascotas?.find(m => m.id === value) || null
  }, [mascotas, value])

  const filteredMascotas = useMemo(() => {
    if (!mascotas) return []
    if (!searchTerm.trim()) return mascotas.slice(0, MAX_RESULTS)
    
    const term = searchTerm.toLowerCase()
    return mascotas
      .filter(m => 
        m.name.toLowerCase().includes(term) || 
        m.user?.name.toLowerCase().includes(term) ||
        m.species.toLowerCase().includes(term)
      )
      .slice(0, MAX_RESULTS)
  }, [mascotas, searchTerm])

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
                {selectedMascota.name} ({selectedMascota.species})
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
            placeholder="Buscar por nombre o propietario..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Cargando mascotas...</CommandEmpty>
            ) : filteredMascotas.length === 0 ? (
              <CommandEmpty>
                No se encontraron mascotas.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                  {filteredMascotas.length} resultado{filteredMascotas.length !== 1 ? 's' : ''}
                </div>
                {filteredMascotas.map((mascota) => (
                  <CommandItem
                    key={mascota.id}
                    value={mascota.id}
                    onSelect={() => handleSelect(mascota.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{mascota.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {mascota.species} • {mascota.race} • Propietario: {mascota.user?.name}
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
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SelectMascota