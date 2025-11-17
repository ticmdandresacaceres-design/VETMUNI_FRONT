"use client"

import { useState } from "react"
import { Filter, X, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useVacunaContext } from "../context/VacunaContext"

export default function VacunaFilters() {
  const { getVacunas, filterVacunasByType, filterVacunasByDateRange } = useVacunaContext()
  
  const [filters, setFilters] = useState({
    tipo: "",
    fechaInicio: undefined as Date | undefined,
    fechaFin: undefined as Date | undefined
  })
  const [showFilters, setShowFilters] = useState(false)

  const tiposVacuna = [
    "Antirrábica", "Parvovirus", "Moquillo", "Hepatitis", "Parainfluenza",
    "Bordetella", "Leptospirosis", "Triple Felina", "Leucemia Felina", "Polivalente", "Otra"
  ]

  const applyFilters = async () => {
    const { tipo, fechaInicio, fechaFin } = filters
    
    if (fechaInicio && fechaFin) {
      const startDate = format(fechaInicio, "yyyy-MM-dd")
      const endDate = format(fechaFin, "yyyy-MM-dd")
      await filterVacunasByDateRange(startDate, endDate)
    } else if (tipo) {
      await filterVacunasByType(tipo)
    } else {
      await getVacunas()
    }
  }

  const clearFilters = async () => {
    setFilters({ tipo: "", fechaInicio: undefined, fechaFin: undefined })
    await getVacunas()
  }

  const removeFilter = async (field: 'tipo' | 'fechas') => {
    if (field === 'tipo') {
      setFilters(prev => ({ ...prev, tipo: "" }))
    } else {
      setFilters(prev => ({ ...prev, fechaInicio: undefined, fechaFin: undefined }))
    }
    await applyFilters()
  }

  const hasActiveFilters = filters.tipo || filters.fechaInicio || filters.fechaFin
  const hasValidDateRange = filters.fechaInicio && filters.fechaFin

  return (
    <div className="space-y-3">
      {/* Header con botón de filtros */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {[filters.tipo, hasValidDateRange].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Panel de filtros compacto */}
      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={filters.tipo || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, tipo: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {tiposVacuna.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha Inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !filters.fechaInicio && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fechaInicio ? format(filters.fechaInicio, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.fechaInicio}
                    onSelect={(date) => setFilters(prev => ({ ...prev, fechaInicio: date }))}
                    disabled={(date) => date > new Date() || (filters.fechaFin ? date > filters.fechaFin : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !filters.fechaFin && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fechaFin ? format(filters.fechaFin, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.fechaFin}
                    onSelect={(date) => setFilters(prev => ({ ...prev, fechaFin: date }))}
                    disabled={(date) => date > new Date() || (filters.fechaInicio ? date < filters.fechaInicio : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button onClick={applyFilters} size="sm" className="flex-1">
              Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                Limpiar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Filtros activos compactos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.tipo && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {filters.tipo}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter('tipo')}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {hasValidDateRange && (
            <Badge variant="secondary" className="gap-1">
              {format(filters.fechaInicio!, "dd/MM/yy")} - {format(filters.fechaFin!, "dd/MM/yy")}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter('fechas')}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}