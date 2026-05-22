"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMascotas, useSearchMascotas } from "../hooks/usePacientes";
import { getVaccineStatus } from "../hooks/usePacientes";
import { useVacunasPorMascota } from "../../vaccines/hooks/useVacunas";
import type { Mascota } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  PawPrint,
  Plus,
  ChevronRight,
  SlidersHorizontal,
  Dog,
  Cat,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const speciesList = ["Todos", "Perro", "Gato", "Otro"];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; class: string }> = {
  al_dia: { label: "Al día", icon: CheckCircle2, class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  proxima: { label: "Próxima", icon: Clock, class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  vencida: { label: "Vencida", icon: XCircle, class: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" },
  sin_vacunas: { label: "Sin vacunas", icon: AlertTriangle, class: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800" },
};

function PetCard({ pet, onClick }: { pet: Mascota; onClick: () => void }) {
  return (
    <PetCardInner pet={pet} onClick={onClick} />
  );
}

function PetCardInner({ pet, onClick }: { pet: Mascota; onClick: () => void }) {
  const { data: vacunas } = useVacunasPorMascota(pet.id);
  const vaccineInfo = useMemo(() => getVaccineStatus(vacunas), [vacunas]);
  const StatusIcon = statusConfig[vaccineInfo.status]?.icon ?? CheckCircle2;

  return (
    <div
      onClick={onClick}
      className="group relative flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background shadow-sm">
          <PawPrint className="w-6 h-6 text-primary" />
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
          pet.status === "ADOPTADO" ? "bg-emerald-500" : "bg-slate-300"
        }`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-base truncate">{pet.name}</h3>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 capitalize shrink-0">
            {pet.species}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {pet.race} · {pet.age}
        </p>
        {pet.user && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            Dueño: {pet.user.name}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[vaccineInfo.status]?.class}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig[vaccineInfo.status]?.label}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

export default function PacientesCatalog() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("Todos");
  const [page, setPage] = useState(1);

  const { data: searchData } = useSearchMascotas(search);
  const { data: mascotasData, isLoading } = useMascotas({ per_page: 20, page });
  const allData = search ? (searchData ?? []) : (mascotasData?.data ?? []);

  const displayedPets = useMemo(() => {
    if (selectedSpecies === "Todos") return allData;
    return allData.filter((pet: Mascota) => pet.species.toLowerCase() === selectedSpecies.toLowerCase());
  }, [allData, selectedSpecies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control veterinario y gestión de pacientes
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/registro")} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, dueño, especie..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10"
          />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Species filter chips */}
      <div className="flex gap-2 flex-wrap">
        {speciesList.map((s) => (
          <button
            key={s}
            onClick={() => { setSelectedSpecies(s); setPage(1); }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedSpecies === s
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {s === "Perro" && <Dog className="w-3.5 h-3.5" />}
            {s === "Gato" && <Cat className="w-3.5 h-3.5" />}
            {s === "Todos" && <PawPrint className="w-3.5 h-3.5" />}
            {s}
          </button>
        ))}
      </div>

      {/* Patient Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : displayedPets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PawPrint className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No se encontraron pacientes</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              {search ? "Intenta con otros términos de búsqueda" : "Registra tu primer paciente para comenzar"}
            </p>
            {!search && (
              <Button onClick={() => router.push("/dashboard/registro")} className="gap-2">
                <Plus className="w-4 h-4" />
                Registrar Paciente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {displayedPets.map((pet: Mascota) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onClick={() => router.push(`/dashboard/pacientes/${pet.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!search && mascotasData?.pagination && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {displayedPets.length} de {mascotasData.pagination.total} pacientes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (mascotasData.pagination.last_page ?? 1)}
              onClick={() => setPage(p => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
