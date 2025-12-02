"use client"

import { VacunaProvider } from "../context/VacunaContext"
import { MascotaProvider } from "../../mascotas/context/MascotaContext"
import VacunasList from "./VacunasList"

export default function VacunasClient() {
  return (
    <MascotaProvider>
      <VacunaProvider>
        <VacunasList />
      </VacunaProvider>
    </MascotaProvider>
  )
}