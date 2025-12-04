"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/src/shared/components/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Users, LogOut, Shield, ExternalLink, Crown } from "lucide-react"
import { AuthGuard } from "@/src/features/auth/context/AuthGuard"
import { useAuthContext } from "@/src/features/auth/context/AuthContext"
import { toast } from "sonner"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { user, logout } = useAuthContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await logout()
      toast.success("Sesión cerrada exitosamente")
      router.push('/login')
    } catch (error: any) {
      console.error('Error durante logout:', error)
      toast.success("Sesión cerrada")
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-lienar-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="animate-pulse">
          <Shield className="h-12 w-12 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRoles={['ADMIN']}>
      <div className="min-h-screen bg-lienar-to-br from-background via-background to-muted/20">
        {/* Header mejorado */}
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-sm">
          <div className="container mx-auto flex h-16 max-w-7xl items-center px-6">
            {/* Logo y navegación */}
            <div className="mr-6 flex items-center">
              <Link 
                href="/dashboard/admin" 
                className="mr-8 flex items-center space-x-3 group transition-all duration-200 hover:scale-105"
              >
                <div className="relative">
                  <Shield className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                  <Crown className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                </div>
                <span className="hidden font-bold text-xl bg-lienar-to-r from-primary to-primary/70 bg-clip-text text-transparent sm:inline-block">
                  Admin Panel
                </span>
              </Link>
              
              {/* Navegación principal */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  href="/dashboard/admin"
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/50 hover:text-primary",
                    pathname === "/dashboard/admin" 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/veterinarios"
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/50 hover:text-primary",
                    pathname?.startsWith("/dashboard/admin/veterinarios")
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Veterinarios
                </Link>
              </nav>
            </div>
            
            {/* Área derecha del header */}
            <div className="flex flex-1 items-center justify-end space-x-4">
              {/* Badge de rol */}
              <Badge 
                variant="secondary" 
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20"
              >
                <Crown className="h-3 w-3" />
                Administrador
              </Badge>

              {/* Controles */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                
                {/* Dropdown del usuario */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                          {user?.nombre ? getUserInitials(user.nombre) : 'AD'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.nombre || 'Administrador'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground mt-1">
                              {user?.correo || 'admin@veterinaria.com'}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Admin
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/dashboard/veterinaria" 
                        target="_blank"
                        className="flex items-center cursor-pointer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Dashboard Veterinario
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive hover:text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Navegación móvil */}
        <div className="md:hidden border-b border-border/50 bg-background/95">
          <nav className="container mx-auto flex items-center space-x-1 px-6 py-2">
            <Link
              href="/dashboard/admin"
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/dashboard/admin" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/admin/veterinarios"
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname?.startsWith("/dashboard/admin/veterinarios")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Veterinarios
            </Link>
          </nav>
        </div>

        {/* Contenido principal centrado */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-7xl mx-auto px-6 py-8">
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}