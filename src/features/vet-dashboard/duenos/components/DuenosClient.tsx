"use client"

import { DuenoProvider } from "../context/DuenoContext"
import DuenosList from "./DuenosList"

export default function DuenosClient() {
  return (
    <DuenoProvider>
      <DuenosList />
    </DuenoProvider>
  )
}