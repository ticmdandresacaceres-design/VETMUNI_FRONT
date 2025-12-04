import type { Metadata } from "next"
import AdminLayoutClient from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Dashboard Admin - VetRegistry",
  description: "Aplicación web para la gestión de una veterinaria",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
