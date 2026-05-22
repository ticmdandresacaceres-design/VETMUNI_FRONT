"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Dueno } from "../types"

interface DuenoFiltersProps {
  duenos: Dueno[]
  onFilterChange: (filtered: Dueno[]) => void
}

export default function DuenoFilters({ duenos, onFilterChange }: DuenoFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (value: string) => {
    setSearchTerm(value)

    const trimmed = value.trim().toLowerCase()

    if (trimmed.length === 0) {
      onFilterChange(duenos)
      return
    }

    const filtered = duenos.filter(
      (dueno) =>
        dueno.name.toLowerCase().includes(trimmed) ||
        dueno.dni.toLowerCase().includes(trimmed) ||
        dueno.email.toLowerCase().includes(trimmed)
    )

    onFilterChange(filtered)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, DNI o email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
