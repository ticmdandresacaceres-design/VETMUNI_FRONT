"use client";

import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { tokenStorage } from "@/src/lib/api/token-storage";

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    fallback?: React.ReactNode;
    inactivityTimeoutMinutes?: number; 
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
    children, 
    requiredRoles = [], 
    fallback,
    inactivityTimeoutMinutes = 15
}) => {
    const { isAuthenticated, isLoading, hasAnyRole, logout } = useAuthContext();
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isHandlingInactivityRef = useRef(false);
    
    // Tiempo en milisegundos
    const INACTIVITY_TIME = inactivityTimeoutMinutes * 60 * 1000;
    const WARNING_TIME = INACTIVITY_TIME - (1 * 60 * 1000); // Advertencia 1 minuto antes

    const handleLogoutDueToInactivity = useCallback(() => {
        // Evitar múltiples ejecuciones
        if (isHandlingInactivityRef.current) return;
        isHandlingInactivityRef.current = true;

        tokenStorage.clearAll();
        
        // Emitir evento para sincronizar otras pestañas
        window.localStorage.setItem('inactivity-logout', Date.now().toString());
        
        // Solo mostrar toast en la pestaña activa
        if (document.visibilityState === 'visible') {
            toast.error("Sesión cerrada por inactividad", {
                description: "Tu sesión ha sido cerrada por seguridad debido a la inactividad.",
                duration: 5000
            });
        }
        
        setTimeout(() => {
            router.push('/login');
        }, 500);
    }, [router]);

    const showInactivityWarning = useCallback(() => {
        // Solo mostrar en pestaña activa
        if (document.visibilityState === 'visible') {
            toast.warning("Sesión expirará pronto", {
                description: "Tu sesión expirará en 1 minuto por inactividad. Realiza alguna acción para mantenerla activa.",
                duration: 10000,
                action: {
                    label: "Mantener activa",
                    onClick: () => {
                        resetInactivityTimer();
                        toast.success("Sesión extendida");
                    }
                }
            });
        }
    }, []);

    const resetInactivityTimer = useCallback(() => {
        // Limpiar timers existentes
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
        }

        // Resetear flag
        isHandlingInactivityRef.current = false;

        // Solo configurar si está autenticado y la pestaña está visible
        if (isAuthenticated && !isLoading && document.visibilityState === 'visible') {
            // Timer para mostrar advertencia
            warningTimeoutRef.current = setTimeout(() => {
                showInactivityWarning();
            }, WARNING_TIME);

            // Timer para cerrar sesión
            timeoutRef.current = setTimeout(() => {
                handleLogoutDueToInactivity();
            }, INACTIVITY_TIME);
        }
    }, [isAuthenticated, isLoading, INACTIVITY_TIME, WARNING_TIME, handleLogoutDueToInactivity, showInactivityWarning]);

    // Eventos que indican actividad del usuario
    const handleUserActivity = useCallback(() => {
        if (isAuthenticated && !isLoading && document.visibilityState === 'visible') {
            resetInactivityTimer();
        }
    }, [isAuthenticated, isLoading, resetInactivityTimer]);

    // Manejar cambio de visibilidad de la pestaña
    const handleVisibilityChange = useCallback(() => {
        if (document.visibilityState === 'visible') {
            // Pestaña activa, reiniciar timer
            resetInactivityTimer();
        } else {
            // Pestaña inactiva, pausar timers
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
        }
    }, [resetInactivityTimer]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        // Configurar listeners de actividad solo si está autenticado
        if (isAuthenticated && !isLoading) {
            const events = [
                'mousedown',
                'mousemove', 
                'keypress',
                'scroll',
                'touchstart',
                'click'
            ];

            // Iniciar el timer si la pestaña está visible
            if (document.visibilityState === 'visible') {
                resetInactivityTimer();
            }

            // Agregar listeners de actividad
            events.forEach(event => {
                document.addEventListener(event, handleUserActivity, true);
            });

            // Listener de visibilidad
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Listener de eventos de storage (sincronización entre pestañas)
            const handleStorageEvent = (event: StorageEvent) => {
                if (event.key === 'inactivity-logout' && !isHandlingInactivityRef.current) {
                    isHandlingInactivityRef.current = true;
                    router.push('/login');
                }
            };
            window.addEventListener('storage', handleStorageEvent);

            // Cleanup
            return () => {
                events.forEach(event => {
                    document.removeEventListener(event, handleUserActivity, true);
                });
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('storage', handleStorageEvent);
                
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                if (warningTimeoutRef.current) {
                    clearTimeout(warningTimeoutRef.current);
                }
            };
        }
    }, [isAuthenticated, isLoading, router, handleUserActivity, handleVisibilityChange, resetInactivityTimer]);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
        };
    }, []);

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-lienar-to-br from-background via-background to-muted/20">
                <Card className="w-full max-w-md border-border/50 shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-lg font-medium">Cargando...</p>
                        <p className="text-sm text-muted-foreground">Verificando permisos</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Si no está autenticado, no mostrar nada (se redirige)
    if (!isAuthenticated) {
        return null;
    }

    // Si requiere roles específicos, verificar
    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen bg-lienar-to-br from-background via-background to-muted/20 p-4">
                <Card className="w-full max-w-lg border-border/50 shadow-lg">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center space-y-6">
                            {/* Icono principal */}
                            <div className="relative">
                                <div className="p-4 bg-destructive/10 rounded-full">
                                    <ShieldAlert className="h-16 w-16 text-destructive" />
                                </div>
                                <AlertTriangle className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 bg-background rounded-full p-0.5" />
                            </div>
                            
                            {/* Título */}
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-foreground">
                                    Acceso Denegado
                                </h1>
                                <p className="text-muted-foreground">
                                    No tienes los permisos necesarios para acceder a esta página
                                </p>
                            </div>

                            {/* Alert */}
                            <Alert className="border-destructive bg-destructive/10">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <AlertDescription className="text-destructive font-medium">
                                    Se requieren permisos de: <span className="font-bold">{requiredRoles.join(', ')}</span>
                                </AlertDescription>
                            </Alert>

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <Button 
                                    variant="outline" 
                                    onClick={() => router.back()}
                                    className="flex-1"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                                <Button 
                                    onClick={() => router.push('/dashboard/veterinaria')}
                                    className="flex-1"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Ir al Dashboard
                                </Button>
                            </div>

                            {/* Mensaje adicional */}
                            <p className="text-xs text-muted-foreground">
                                Si crees que esto es un error, contacta al administrador del sistema
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
};