"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDuenos, useCreateDueno } from "../../owners/hooks/useDuenos";
import { useGetMascotasByOwner, useCreateMascota } from "../hooks/usePacientes";
import { useCreateVacuna } from "../../vaccines/hooks/useVacunas";
import type { Dueno } from "../../owners/types";
import type { Mascota } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  PawPrint,
  Syringe,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  IdCard,
  Users,
  X,
  ArrowLeft,
  Loader2,
  Plus,
  SkipForward,
} from "lucide-react";

const DEFAULT_LAT = -13.162349554460294;
const DEFAULT_LNG = -74.21340682262704;

const speciesOptions = ["Perro", "Gato", "Ave", "Conejo", "Hamster", "Pez", "Reptil", "Otro"];
const genderOptions = ["MACHO", "HEMBRA"];
const reproductiveConditionOptions = ["ENTERO", "CASTRADO"];
const temperamentOptions = ["Tranquilo", "Activo", "Agresivo", "Tímido", "Sociable", "Juguetón"];

const vacunasPerro = [
  "Rabia",
  "Séxtuple",
  "Quíntuple",
  "Moquillo",
  "Parvovirus",
  "Leptospirosis",
  "Bordetella (Tos de las perreras)",
  "Giardia",
  "Coronavirus",
  "Hepatitis Infecciosa",
  "Triple Canina",
  "Polivalente",
  "Otra",
];

const vacunasGato = [
  "Rabia",
  "Triple Felina (Viral)",
  "Cuádruple Felina",
  "Leucemia Felina (FeLV)",
  "Panleucopenia",
  "Calicivirus",
  "Rinotraqueítis",
  "Clamidiasis",
  "Peritonitis Infecciosa (PIF)",
  "Inmunodeficiencia Felina (FIV)",
  "Otra",
];

const allVacunas = [...new Set([...vacunasPerro, ...vacunasGato])];

type WizardStep = 1 | 2 | 3;

export default function RegistroWizard() {
  const router = useRouter();
  const createDueno = useCreateDueno();
  const createMascota = useCreateMascota();
  const createVacuna = useCreateVacuna();

  const [step, setStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Owner
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<Dueno | null>(null);
  const [showCreateOwner, setShowCreateOwner] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: "", dni: "", phone: "", email: "", address: "" });

  // Step 2: Pet
  const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);
  const [showCreatePet, setShowCreatePet] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "", species: "Perro", race: "", gender: "MACHO",
    color: "", temperament: "", reproductive_condition: "ENTERO",
    years: 0, months: 0,
  });

  // Step 3: Vaccine
  const [skipVaccine, setSkipVaccine] = useState(true);
  const [vaccineType, setVaccineType] = useState("");
  const [vaccineDate, setVaccineDate] = useState(new Date().toISOString().split("T")[0]);
  const [vaccineMonths, setVaccineMonths] = useState("12");

  // Owner search
  const { data: duenosData } = useDuenos({ per_page: 50 });
  const allOwners = duenosData?.data ?? [];
  const searchedOwners = ownerSearch
    ? allOwners.filter((o: Dueno) =>
        o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.dni.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        (o.phone ?? "").toLowerCase().includes(ownerSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  // Pets of selected owner
  const { data: ownerPets } = useGetMascotasByOwner(selectedOwner?.id ?? "");
  const existingPets = ownerPets ?? [];

  const canProceedStep1 = !!selectedOwner;
  const canProceedStep2 = !!selectedPet;
  const canProceedStep3 = skipVaccine || (vaccineType.trim() !== "");

  const handleSelectOwner = (owner: Dueno) => {
    setSelectedOwner(owner);
    setSelectedPet(null);
    setShowCreatePet(false);
  };

  const handleCreateOwner = async () => {
    if (!newOwner.name.trim() || !newOwner.dni.trim()) {
      toast.error("Nombre y DNI son obligatorios");
      return;
    }
    try {
      const result = await createDueno.mutateAsync({
        name: newOwner.name,
        dni: newOwner.dni,
        email: newOwner.email || `${newOwner.dni}@email.com`,
        phone: newOwner.phone || undefined,
        address: newOwner.address || undefined,
        password: newOwner.dni,
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
      });
      setSelectedOwner(result as Dueno);
      setShowCreateOwner(false);
      setNewOwner({ name: "", dni: "", phone: "", email: "", address: "" });
    } catch {}
  };

  const handleCreatePet = async () => {
    if (!newPet.name.trim()) {
      toast.error("El nombre de la mascota es obligatorio");
      return;
    }
    if (!selectedOwner) return;

    try {
      const result = await createMascota.mutateAsync({
        name: newPet.name,
        species: newPet.species,
        race: newPet.race || "No especificada",
        gender: newPet.gender,
        color: newPet.color || "No especificado",
        temperament: newPet.temperament || "No especificado",
        reproductive_condition: newPet.reproductive_condition,
        years: newPet.years,
        months: newPet.months,
        status: "ADOPTADO",
        user_id: selectedOwner.id,
      });
      setSelectedPet(result as Mascota);
      setShowCreatePet(false);
    } catch {}
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      if (!skipVaccine && selectedPet) {
        await createVacuna.mutateAsync({
          type: vaccineType,
          aplication_date: vaccineDate,
          months_validity: parseInt(vaccineMonths) || 12,
          pet_id: selectedPet.id,
        });
      }
      router.push(`/dashboard/pacientes/${selectedPet?.id}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Registro</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registra un paciente en tres pasos simples
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as const).map((s) => {
          const isComplete = s < step;
          const isCurrent = s === step;
          const labels: Record<number, string> = { 1: "Dueño", 2: "Mascota", 3: "Vacuna" };
          const icons = { 1: Users, 2: PawPrint, 3: Syringe } as const;
          const Icon = icons[s];

          return (
            <div key={s} className={`flex-1 flex items-center gap-2 ${s < 3 ? "flex-1" : ""}`}>
              <div className={`flex items-center gap-2 min-w-0 ${s < 3 ? "flex-1" : ""}`}>
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs sm:text-sm font-medium truncate ${
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}>
                  <span className="hidden sm:inline">{labels[s]}</span>
                </span>
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${
                  isComplete ? "bg-primary" : "bg-border"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Owner */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                ¿Quién es el dueño?
              </h2>
              <p className="text-sm text-muted-foreground">
                Busca un dueño existente o registra uno nuevo
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, teléfono o DNI..."
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Results */}
            {ownerSearch && searchedOwners.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Resultados</p>
                {searchedOwners.map((owner: Dueno) => (
                  <div
                    key={owner.id}
                    onClick={() => handleSelectOwner(owner)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedOwner?.id === owner.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {owner.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{owner.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {owner.phone ?? "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <IdCard className="w-3 h-3" /> {owner.dni}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {existingPets.length} mascota{existingPets.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* No results / Create new */}
            {ownerSearch && searchedOwners.length === 0 && !showCreateOwner && (
              <div className="text-center py-6 border-2 border-dashed rounded-xl">
                <UserPlus className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="font-medium mb-1">No se encontraron dueños</p>
                <p className="text-sm text-muted-foreground mb-4">Regístralo para continuar</p>
                <Button onClick={() => setShowCreateOwner(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar Dueño
                </Button>
              </div>
            )}

            {!ownerSearch && !showCreateOwner && (
              <div className="text-center py-4">
                <Button variant="outline" onClick={() => setShowCreateOwner(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar nuevo dueño
                </Button>
              </div>
            )}

            {/* Selected Owner */}
            {selectedOwner && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{selectedOwner.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedOwner.phone} · {selectedOwner.dni}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedOwner.email}
                  </Badge>
                </div>
              </div>
            )}

            {/* Create Owner Form */}
            {showCreateOwner && (
              <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Nuevo Dueño</h3>
                  <button onClick={() => setShowCreateOwner(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Nombre completo *</Label>
                    <Input value={newOwner.name} onChange={(e) => setNewOwner(p => ({ ...p, name: e.target.value }))} placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">DNI *</Label>
                    <Input value={newOwner.dni} onChange={(e) => setNewOwner(p => ({ ...p, dni: e.target.value }))} placeholder="12345678" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Teléfono</Label>
                    <Input value={newOwner.phone} onChange={(e) => setNewOwner(p => ({ ...p, phone: e.target.value }))} placeholder="999-888-777" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input value={newOwner.email} onChange={(e) => setNewOwner(p => ({ ...p, email: e.target.value }))} placeholder="juan@email.com" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Dirección</Label>
                    <Input value={newOwner.address} onChange={(e) => setNewOwner(p => ({ ...p, address: e.target.value }))} placeholder="Av. Principal 123" />
                  </div>
                </div>
                <Button onClick={handleCreateOwner} disabled={createDueno.isPending} className="w-full gap-2">
                  {createDueno.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {createDueno.isPending ? "Registrando..." : "Guardar Dueño"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pet */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-primary" />
                Seleccionar o registrar mascota
              </h2>
              <p className="text-sm text-muted-foreground">
                Dueño: <span className="font-medium text-foreground">{selectedOwner?.name}</span>
              </p>
            </div>

            {/* Existing pets */}
            {existingPets.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                  Mascotas existentes de {selectedOwner?.name?.split(" ")[0]}
                </p>
                <div className="space-y-2">
                  {existingPets.map((pet: Mascota) => (
                    <div
                      key={pet.id}
                      onClick={() => { setSelectedPet(pet); setShowCreatePet(false); }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedPet?.id === pet.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <PawPrint className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{pet.name}</p>
                        <p className="text-xs text-muted-foreground">{pet.species} · {pet.race} · {pet.age}</p>
                      </div>
                      {selectedPet?.id === pet.id && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showCreatePet && (
              <div className="text-center">
                <Button variant="outline" onClick={() => { setShowCreatePet(true); setSelectedPet(null); }} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar nueva mascota
                </Button>
              </div>
            )}

            {/* Create pet form */}
            {showCreatePet && (
              <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Nueva Mascota</h3>
                  <button onClick={() => setShowCreatePet(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Nombre *</Label>
                    <Input value={newPet.name} onChange={(e) => setNewPet(p => ({ ...p, name: e.target.value }))} placeholder="Max" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Especie</Label>
                    <Select
                      value={newPet.species}
                      onValueChange={(v) => setNewPet(p => ({ ...p, species: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especie" />
                      </SelectTrigger>
                      <SelectContent>
                        {speciesOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Raza</Label>
                    <Input value={newPet.race} onChange={(e) => setNewPet(p => ({ ...p, race: e.target.value }))} placeholder="Pastor Alemán" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Género</Label>
                    <Select
                      value={newPet.gender}
                      onValueChange={(v) => setNewPet(p => ({ ...p, gender: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar género" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt === "MACHO" ? "Macho" : "Hembra"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Color</Label>
                    <Input value={newPet.color} onChange={(e) => setNewPet(p => ({ ...p, color: e.target.value }))} placeholder="Marrón" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Temperamento</Label>
                    <Select
                      value={newPet.temperament}
                      onValueChange={(v) => setNewPet(p => ({ ...p, temperament: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar temperamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {temperamentOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Cond. Reproductiva</Label>
                    <Select
                      value={newPet.reproductive_condition}
                      onValueChange={(v) => setNewPet(p => ({ ...p, reproductive_condition: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar condición" />
                      </SelectTrigger>
                      <SelectContent>
                        {reproductiveConditionOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt === "ENTERO" ? "Entero" : "Castrado"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Años</Label>
                    <Input type="number" min={0} value={newPet.years || ""} onChange={(e) => setNewPet(p => ({ ...p, years: parseInt(e.target.value) || 0 }))} placeholder="2" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meses</Label>
                    <Input type="number" min={0} max={11} value={newPet.months || ""} onChange={(e) => setNewPet(p => ({ ...p, months: parseInt(e.target.value) || 0 }))} placeholder="6" />
                  </div>
                </div>
                <Button onClick={handleCreatePet} disabled={createMascota.isPending} className="w-full gap-2">
                  {createMascota.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PawPrint className="w-4 h-4" />}
                  {createMascota.isPending ? "Registrando..." : "Guardar Mascota"}
                </Button>
              </div>
            )}

            {/* Selected pet summary */}
            {selectedPet && !showCreatePet && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{selectedPet.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPet.species} · {selectedPet.race} · {selectedPet.age}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Vaccine */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Syringe className="w-5 h-5 text-primary" />
                Registrar vacuna
              </h2>
              <p className="text-sm text-muted-foreground">
                Paciente: <span className="font-medium text-foreground">{selectedPet?.name}</span> · Dueño: {selectedOwner?.name}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/20">
              <button
                type="button"
                onClick={() => { setSkipVaccine(!skipVaccine); if (skipVaccine) setVaccineType(""); }}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  !skipVaccine ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  !skipVaccine ? "translate-x-4" : ""
                }`} />
              </button>
              <div>
                <p className="text-sm font-medium">Registrar vacuna ahora</p>
                <p className="text-xs text-muted-foreground">Puedes registrarla después desde el perfil del paciente</p>
              </div>
            </div>

            {!skipVaccine && (
              <div className="space-y-4 p-4 rounded-xl border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tipo de vacuna</Label>
                  <Select value={vaccineType} onValueChange={setVaccineType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vacuna..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Perros</div>
                      {vacunasPerro.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Gatos</div>
                      {vacunasGato.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Fecha de aplicación</Label>
                    <Input type="date" value={vaccineDate} onChange={(e) => setVaccineDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Validez (meses)</Label>
                    <Input type="number" value={vaccineMonths} onChange={(e) => setVaccineMonths(e.target.value)} min={1} placeholder="12" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep((step - 1) as WizardStep)} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            onClick={() => setStep((step + 1) as WizardStep)}
            disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
            className="gap-2"
          >
            Continuar
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => { setSkipVaccine(true); handleFinish(); }}
              disabled={isSubmitting}
              className="gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Omitir y finalizar
            </Button>
            <Button
              onClick={() => { setSkipVaccine(false); handleFinish(); }}
              disabled={!canProceedStep3 || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSubmitting ? "Guardando..." : "Guardar y Finalizar"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
