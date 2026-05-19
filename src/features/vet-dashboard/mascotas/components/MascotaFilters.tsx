"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Mascota } from "../types"

interface MascotaFiltersProps {
  mascotas: Mascota[]
  onFilterChange: (filtered: Mascota[]) => void
}

export default function MascotaFilters({ mascotas, onFilterChange }: MascotaFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    especie: "",
    gender: "",
    raza: ""
  })
  const [showFilters, setShowFilters] = useState(false)

  const applyFilters = () => {
    const trimmed = searchTerm.trim().toLowerCase()
    const { especie, gender, raza } = filters

    let result = mascotas

    if (trimmed.length > 0) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(trimmed) ||
          m.race.toLowerCase().includes(trimmed) ||
          m.user?.name.toLowerCase().includes(trimmed)
      )
    }

    if (especie) {
      result = result.filter((m) => m.species.toLowerCase() === especie.toLowerCase())
    }

    if (gender) {
      result = result.filter((m) => m.gender.toLowerCase() === gender.toLowerCase())
    }

    if (raza) {
      result = result.filter((m) => m.race.toLowerCase().includes(raza.toLowerCase()))
    }

    onFilterChange(result)
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === "all" ? "" : value
    }))
  }

  const clearFilters = () => {
    setFilters({ especie: "", gender: "", raza: "" })
    setSearchTerm("")
    onFilterChange(mascotas)
  }

  const hasActiveFilters = filters.especie || filters.gender || filters.raza
  const hasActiveSearch = searchTerm.trim().length > 0

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, raza o dueño..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setTimeout(() => applyFilters(), 0)
              }}
              className="pl-9"
            />
            {hasActiveSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  applyFilters()
                }}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {Object.values(filters).filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-card p-4 mt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Especie</label>
              <Select
                value={filters.especie || "all"}
                onValueChange={(value) => {
                  handleFilterChange("especie", value)
                  setTimeout(() => applyFilters(), 0)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especies</SelectItem>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Ave">Ave</SelectItem>
                  <SelectItem value="Conejo">Conejo</SelectItem>
                  <SelectItem value="Hamster">Hamster</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sexo</label>
              <Select
                value={filters.gender || "all"}
                onValueChange={(value) => {
                  handleFilterChange("gender", value)
                  setTimeout(() => applyFilters(), 0)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los sexos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sexos</SelectItem>
                  <SelectItem value="MACHO">Macho</SelectItem>
                  <SelectItem value="HEMBRA">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Raza</label>
              <Input
                placeholder="Filtrar por raza..."
                value={filters.raza}
                onChange={(e) => {
                  handleFilterChange("raza", e.target.value)
                  setTimeout(() => applyFilters(), 0)
                }}
              />
            </div>

            <div className="flex flex-col justify-end space-y-2 sm:col-span-3 lg:col-span-1">
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {filters.especie && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Especie: {filters.especie}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleFilterChange("especie", "")
                      setTimeout(() => applyFilters(), 0)
                    }}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.gender && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sexo: {filters.gender}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleFilterChange("gender", "")
                      setTimeout(() => applyFilters(), 0)
                    }}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.raza && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Raza: {filters.raza}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleFilterChange("raza", "")
                      setTimeout(() => applyFilters(), 0)
                    }}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
