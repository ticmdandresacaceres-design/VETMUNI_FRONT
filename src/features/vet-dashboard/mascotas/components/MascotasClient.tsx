"use client"

import { MascotaProvider } from "../context/MascotaContext"
import { DuenoProvider } from "../../duenos/context/DuenoContext"
import MascotasList from "./MascotasList"

export default function MascotasClient() {
  return (
    <DuenoProvider>
      <MascotaProvider>
        <MascotasList />
      </MascotaProvider>
    </DuenoProvider>
  )
}