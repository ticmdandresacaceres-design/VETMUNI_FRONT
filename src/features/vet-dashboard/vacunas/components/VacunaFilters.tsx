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
import type { Vacuna } from "../types"

interface VacunaFiltersProps {
  vacunas: Vacuna[]
  onFilterChange: (filtered: Vacuna[]) => void
}

export default function VacunaFilters({ vacunas, onFilterChange }: VacunaFiltersProps) {
  const [filters, setFilters] = useState({
    tipo: "",
    estado: "",
    fechaInicio: undefined as Date | undefined,
    fechaFin: undefined as Date | undefined
  })
  const [showFilters, setShowFilters] = useState(false)

  const tiposVacuna = [
    "Antirrábica", "Parvovirus", "Moquillo", "Hepatitis", "Parainfluenza",
    "Bordetella", "Leptospirosis", "Triple Felina", "Leucemia Felina", "Polivalente", "Otra"
  ]

  const getEstadoVencimiento = (expirationDate: string) => {
    const hoy = new Date()
    const vencimiento = new Date(expirationDate)
    const diferenciaDias = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

    if (diferenciaDias < 0) return "Vencida"
    if (diferenciaDias <= 30) return "Por vencer"
    return "Vigente"
  }

  const applyFilters = () => {
    const { tipo, estado, fechaInicio, fechaFin } = filters

    let result = vacunas

    if (tipo) {
      result = result.filter((v) => v.type.toLowerCase() === tipo.toLowerCase())
    }

    if (estado) {
      result = result.filter((v) => getEstadoVencimiento(v.expiration_date) === estado)
    }

    if (fechaInicio) {
      const startStr = format(fechaInicio, "yyyy-MM-dd")
      result = result.filter((v) => v.aplication_date >= startStr)
    }

    if (fechaFin) {
      const endStr = format(fechaFin, "yyyy-MM-dd")
      result = result.filter((v) => v.aplication_date <= endStr)
    }

    onFilterChange(result)
  }

  const clearFilters = () => {
    setFilters({ tipo: "", estado: "", fechaInicio: undefined, fechaFin: undefined })
    onFilterChange(vacunas)
  }

  const removeFilter = (field: 'tipo' | 'estado' | 'fechas') => {
    if (field === 'tipo') {
      setFilters(prev => ({ ...prev, tipo: "" }))
    } else if (field === 'estado') {
      setFilters(prev => ({ ...prev, estado: "" }))
    } else {
      setFilters(prev => ({ ...prev, fechaInicio: undefined, fechaFin: undefined }))
    }
    setTimeout(() => applyFilters(), 0)
  }

  const hasActiveFilters = filters.tipo || filters.estado || filters.fechaInicio || filters.fechaFin
  const hasValidDateRange = filters.fechaInicio && filters.fechaFin

  return (
    <div className="space-y-3">
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
              {[filters.tipo, filters.estado, hasValidDateRange].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={filters.tipo || "all"}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, tipo: value === "all" ? "" : value }))
                  setTimeout(() => applyFilters(), 0)
                }}
              >
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.estado || "all"}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, estado: value === "all" ? "" : value }))
                  setTimeout(() => applyFilters(), 0)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Vigente">Vigente</SelectItem>
                  <SelectItem value="Por vencer">Por vencer</SelectItem>
                  <SelectItem value="Vencida">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                    onSelect={(date) => {
                      setFilters(prev => ({ ...prev, fechaInicio: date }))
                      setTimeout(() => applyFilters(), 0)
                    }}
                    disabled={(date) => date > new Date() || (filters.fechaFin ? date > filters.fechaFin : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

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
                    onSelect={(date) => {
                      setFilters(prev => ({ ...prev, fechaFin: date }))
                      setTimeout(() => applyFilters(), 0)
                    }}
                    disabled={(date) => date > new Date() || (filters.fechaInicio ? date < filters.fechaInicio : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                Limpiar
              </Button>
            )}
          </div>
        </div>
      )}

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
          {filters.estado && (
            <Badge variant="secondary" className="gap-1">
              Estado: {filters.estado}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter('estado')}
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
