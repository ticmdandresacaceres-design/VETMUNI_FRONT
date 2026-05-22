"use client"

import { useState } from "react"
import { useUser, userKeys } from "@/src/features/auth/hooks/useUser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Save } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/src/lib/api/axios"
import { ENDPOINTS } from "@/src/lib/api/endpoint"
import { useQueryClient } from "@tanstack/react-query"

export default function ProfilePage() {
  const { data: user, isLoading } = useUser()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await apiClient.put(ENDPOINTS.users.veterinarians.update(user.id), { name })
      await queryClient.invalidateQueries({ queryKey: userKeys.me })
      toast.success("Perfil actualizado correctamente")
      setIsEditing(false)
    } catch {
      toast.error("Error al actualizar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu información personal
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {user?.name ? getUserInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              {Array.isArray(user?.role) ? user.role.join(', ') : user?.role}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false)
                  setName(user?.name || "")
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </>
            ) : (
              <Button onClick={() => {
                setIsEditing(true)
                setName(user?.name || "")
              }}>
                Editar perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
