"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useMascotaContext } from "../context/MascotaContext"

export default function MascotaFilters() {
  const { searchMascotas, filterMascotas, getMascotas } = useMascotaContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    especie: "",
    sexo: "",
    raza: ""
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      await getMascotas()
      return
    }

    // Solo hacer fetch cuando haya al menos 3 caracteres
    if (trimmed.length >= 3) {
      await searchMascotas(trimmed)
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const applyFilters = async () => {
    const { especie, sexo, raza } = filters
    
    if (!especie && !sexo && !raza) {
      await getMascotas()
      return
    }

    const params: (string | undefined)[] = []
    
    params.push(especie && especie.trim() ? especie : undefined)
    params.push(sexo && sexo.trim() ? sexo : undefined)
    params.push(raza && raza.trim() ? raza : undefined)

    await filterMascotas(...params)
  }

  const clearFilters = async () => {
    setFilters({
      especie: "",
      sexo: "",
      raza: ""
    })
    await getMascotas()
  }

  const clearSearch = async () => {
    setSearchTerm("")
    await getMascotas()
  }

  const hasActiveFilters = filters.especie || filters.sexo || filters.raza
  const hasActiveSearch = searchTerm.trim().length > 0

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
            {hasActiveSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Botón para mostrar/ocultar filtros */}
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

      {/* Panel de filtros desplegable */}
      {showFilters && (
        <div className="rounded-lg border bg-card p-4 mt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* Filtro por Especie */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Especie</label>
              <Select 
                value={filters.especie || "all"} 
                onValueChange={(value) => handleFilterChange("especie", value === "all" ? "" : value)}
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

            {/* Filtro por Sexo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sexo</label>
              <Select 
                value={filters.sexo || "all"} 
                onValueChange={(value) => handleFilterChange("sexo", value === "all" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los sexos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sexos</SelectItem>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Raza */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Raza</label>
              <Input
                placeholder="Filtrar por raza..."
                value={filters.raza}
                onChange={(e) => handleFilterChange("raza", e.target.value)}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col justify-end space-y-2 sm:col-span-3 lg:col-span-1">
              <Button 
                onClick={applyFilters}
                size="sm"
                className="w-full"
              >
                Aplicar Filtros
              </Button>
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

          {/* Filtros activos */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {filters.especie && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Especie: {filters.especie}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange("especie", "")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.sexo && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sexo: {filters.sexo}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange("sexo", "")}
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
                    onClick={() => handleFilterChange("raza", "")}
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