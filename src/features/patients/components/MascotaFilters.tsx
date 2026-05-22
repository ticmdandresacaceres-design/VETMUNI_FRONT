"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Mascota, UserBrief } from "../types"

interface MascotaFiltersProps {
  mascotas: Mascota[]
  onFilterChange: (filtered: Mascota[]) => void
}

export default function MascotaFilters({ mascotas, onFilterChange }: MascotaFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [speciesFilter, setSpeciesFilter] = useState("")

  const uniqueOwners = useMemo(() => {
    const ownersMap = new Map<string, UserBrief>()
    mascotas.forEach((m) => {
      if (m.user && !ownersMap.has(m.user.id)) {
        ownersMap.set(m.user.id, m.user)
      }
    })
    return Array.from(ownersMap.values())
  }, [mascotas])

  const uniqueSpecies = useMemo(() => {
    const speciesSet = new Set(mascotas.map((m) => m.species))
    return Array.from(speciesSet)
  }, [mascotas])

  const applyFilters = (search: string, species: string) => {
    const trimmedSearch = search.trim().toLowerCase()
    const trimmedSpecies = species.trim()

    let filtered = mascotas

    if (trimmedSearch.length > 0) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(trimmedSearch) ||
          m.race.toLowerCase().includes(trimmedSearch) ||
          m.user?.name.toLowerCase().includes(trimmedSearch)
      )
    }

    if (trimmedSpecies.length > 0) {
      filtered = filtered.filter((m) => m.species === trimmedSpecies)
    }

    onFilterChange(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters(value, speciesFilter)
  }

  const handleSpeciesChange = (value: string) => {
    setSpeciesFilter(value)
    applyFilters(searchTerm, value)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, raza o dueño..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={speciesFilter} onValueChange={handleSpeciesChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todas las especies" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las especies</SelectItem>
          {uniqueSpecies.map((species) => (
            <SelectItem key={species} value={species}>
              {species}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
