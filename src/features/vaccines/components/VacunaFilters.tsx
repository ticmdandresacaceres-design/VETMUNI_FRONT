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
import type { Vacuna, PetBrief } from "../types"

interface VacunaFiltersProps {
  vacunas: Vacuna[]
  onFilterChange: (filtered: Vacuna[]) => void
}

export default function VacunaFilters({ vacunas, onFilterChange }: VacunaFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const uniquePets = useMemo(() => {
    const petsMap = new Map<string, PetBrief>()
    vacunas.forEach((v) => {
      if (v.pet && !petsMap.has(v.pet.id)) {
        petsMap.set(v.pet.id, v.pet)
      }
    })
    return Array.from(petsMap.values())
  }, [vacunas])

  const getVacunaStatus = (expirationDate: string) => {
    const now = new Date()
    const exp = new Date(expirationDate)
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Vencida"
    if (diffDays <= 30) return "Próxima a vencer"
    return "Vigente"
  }

  const applyFilters = (search: string, status: string) => {
    const trimmedSearch = search.trim().toLowerCase()
    const trimmedStatus = status.trim()

    let filtered = vacunas

    if (trimmedSearch.length > 0) {
      filtered = filtered.filter(
        (v) =>
          v.type.toLowerCase().includes(trimmedSearch) ||
          v.pet?.name.toLowerCase().includes(trimmedSearch)
      )
    }

    if (trimmedStatus.length > 0 && trimmedStatus !== "all") {
      filtered = filtered.filter((v) => getVacunaStatus(v.expiration_date) === trimmedStatus)
    }

    onFilterChange(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters(value, statusFilter)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    applyFilters(searchTerm, value)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por tipo o mascota..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="Vigente">Vigente</SelectItem>
          <SelectItem value="Próxima a vencer">Próxima a vencer</SelectItem>
          <SelectItem value="Vencida">Vencida</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
