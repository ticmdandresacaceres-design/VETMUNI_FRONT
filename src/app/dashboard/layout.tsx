import type { Metadata } from "next"
import DashboardLayoutWrapper from "./DashboardLayoutWrapper"

export const metadata: Metadata = {
  title: "Dashboard - VetRegistry",
  description: "Aplicación web para la gestión de una veterinaria",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
}
