"use client"

import { VacunaProvider } from "../context/VacunaContext"
import { MascotaProvider } from "../../mascotas/context/MascotaContext"
import VacunasCard from "./VacunasList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Syringe, Shield } from "lucide-react"

export default function VacunasClient() {
  return (
    <MascotaProvider>
      <VacunaProvider>
        <div className="space-y-6">
          <Card className="border-0 shadow-sm bg-linear-to-r from-background to-muted/20">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Syringe className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      Gestión de Vacunas
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      Administra el registro y seguimiento de vacunas aplicadas a las mascotas
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Shield className="h-3 w-3" />
                    Sistema Activo
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <VacunasCard />
            </CardContent>
          </Card>
        </div>
      </VacunaProvider>
    </MascotaProvider>
  )
}