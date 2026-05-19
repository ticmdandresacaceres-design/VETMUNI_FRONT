"use client"

import { useState, useMemo } from "react"
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
import { useDuenos } from "../../duenos/hooks/useDuenos"

interface SelectDuenoProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const MAX_RESULTS = 10

function SelectDueno({ 
  value, 
  onValueChange, 
  placeholder = "Buscar propietario...",
  disabled = false 
}: SelectDuenoProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { data: duenos, isLoading: loading } = useDuenos()

  const selectedDueno = useMemo(() => {
    return duenos?.find(d => d.id === value) || null
  }, [duenos, value])

  const filteredDuenos = useMemo(() => {
    if (!duenos) return []
    if (!searchTerm.trim()) return duenos.slice(0, MAX_RESULTS)
    
    const term = searchTerm.toLowerCase()
    return duenos
      .filter(d => 
        d.name.toLowerCase().includes(term) || 
        d.dni.toLowerCase().includes(term)
      )
      .slice(0, MAX_RESULTS)
  }, [duenos, searchTerm])

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
                {selectedDueno.name} - {selectedDueno.dni}
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
            placeholder="Buscar por nombre o DNI..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Cargando propietarios...</CommandEmpty>
            ) : filteredDuenos.length === 0 ? (
              <CommandEmpty>
                No se encontraron propietarios.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                  {filteredDuenos.length} resultado{filteredDuenos.length !== 1 ? 's' : ''}
                </div>
                {filteredDuenos.map((dueno) => (
                  <CommandItem
                    key={dueno.id}
                    value={dueno.id}
                    onSelect={() => handleSelect(dueno.id)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{dueno.name}</span>
                      <span className="text-sm text-muted-foreground">
                        DNI: {dueno.dni} • Tel: {dueno.phone}
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
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SelectDueno