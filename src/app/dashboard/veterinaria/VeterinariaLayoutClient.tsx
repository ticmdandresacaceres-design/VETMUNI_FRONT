"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/src/shared/components/ThemeToggle"
import { Metadata } from "next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  PawPrint,
  Users,
  FileText,
  FileDown,
  Menu,
  LogOut,
  Settings,
  User,
  Stethoscope,
  ChevronRight
} from "lucide-react"
import { AuthGuard } from "@/src/features/auth/context/AuthGuard"
import { useAuthContext } from "@/src/features/auth/context/AuthContext"
import { toast } from "sonner"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/veterinaria",
    icon: LayoutDashboard,
    description: "Vista general"
  },
  {
    title: "Dueños",
    href: "/dashboard/veterinaria/duenos",
    icon: Users,
    description: "Propietarios"
  },
  {
    title: "Mascotas",
    href: "/dashboard/veterinaria/mascotas",
    icon: PawPrint,
    description: "Registro de mascotas"
  },
  {
    title: "Vacunas",
    href: "/dashboard/veterinaria/vacunas",
    icon: FileText,
    description: "Historial de vacunación"
  },
  {
    title: "Reportes",
    href: "/dashboard/veterinaria/reportes",
    icon: FileDown,
    description: "Exportar datos"
  },
]
export const metadata: Metadata = {
  title: "Dashboard Veterinaria - VetRegistry",
  description: "Aplicación web para la gestión de una veterinaria",
};

interface VeterinariaLayoutProps {
  children: React.ReactNode
}

export default function VeterinariaLayoutClient({ children }: VeterinariaLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden w-72 flex-col border-r lg:flex bg-card">
          <div className="flex h-16 items-center border-b px-6">
            <div className="h-8 w-8 bg-muted rounded-xl animate-pulse" />
            <div className="ml-3 space-y-2">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="flex-1 px-4 py-6 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center rounded-xl px-4 py-3 bg-muted/50 animate-pulse">
                <div className="h-5 w-5 bg-muted rounded mr-3" />
                <div className="flex-1">
                  <div className="h-4 w-20 bg-muted rounded mb-1" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center border-b px-6 bg-card">
            <div className="flex flex-1 items-center justify-between">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
                <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 bg-linear-to-br from-background via-background to-muted/20">
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </main>
        </div>
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card">
      {/* Logo y Header del Sidebar */}
      <div className="flex h-16 items-center border-b px-6 bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl"></div>
            <div className="relative w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              VetRegistry
            </span>
            <p className="text-xs text-muted-foreground">Sistema Veterinario</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            // Comparación exacta para el dashboard, con subpaths para los demás
            const isActive = item.href === "/dashboard/veterinaria" 
              ? pathname === item.href 
              : pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                  isActive 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <Icon className="h-4 w-4 shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-primary" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer del Sidebar */}
      <div className="border-t p-4 bg-muted/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-accent transition-colors cursor-pointer">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-semibold">
              {user?.nombre ? getUserInitials(user.nombre) : 'VT'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.nombre || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.correo || 'email@veterinaria.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AuthGuard requiredRoles={['VETERINARIA', 'ADMIN']}>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 flex-col border-r lg:flex">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center border-b bg-card/95 backdrop-blur-sm px-4 lg:px-6 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2 hover:bg-primary/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-semibold">Panel Veterinario</h1>
                </div>
                <Badge variant="secondary" className="hidden md:flex">
                  {user?.roles || 'Veterinaria'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                          {user?.nombre ? getUserInitials(user.nombre) : 'VT'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-3 p-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                              {user?.nombre ? getUserInitials(user.nombre) : 'VT'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user?.nombre || 'Usuario'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.correo || 'email@veterinaria.com'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="w-fit text-xs">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          Rol: {user?.roles || 'Veterinaria'}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
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
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-linear-to-br from-background via-background to-muted/20 p-4 lg:p-6">
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t bg-muted/30 px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-primary" />
                <span>Sistema Veterinario Municipal - VetRegistry 2024</span>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                v1.0.0
              </Badge>
            </div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  )
}