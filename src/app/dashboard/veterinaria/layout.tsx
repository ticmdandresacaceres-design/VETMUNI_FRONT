import type { Metadata } from "next"
import VeterinariaLayoutClient from "./VeterinariaLayoutClient"

export const metadata: Metadata = {
  title: "Dashboard Veterinaria - VetRegistry",
  description: "Aplicación web para la gestión de una veterinaria",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <VeterinariaLayoutClient>{children}</VeterinariaLayoutClient>
}
