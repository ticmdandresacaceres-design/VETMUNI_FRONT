import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { Heart, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function LoginPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-primary/5 flex flex-col lg:flex-row">
            {/* Sección izquierda - Información */}
            <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
                <div className="max-w-lg mx-auto lg:mx-0">
                    {/* Logo y título principal */}
                    <div className="text-center lg:text-left mb-8">
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <div className="bg-primary rounded-full p-3">
                                <Heart className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            VetRegistry
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Sistema integral de gestión veterinaria
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-primary/10 rounded-lg p-2">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Gestión de Pacientes</h3>
                                <p className="text-sm text-muted-foreground">
                                    Administra la información de mascotas y sus propietarios de manera eficiente
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-primary/20 rounded-lg p-2">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Control de Vacunas</h3>
                                <p className="text-sm text-muted-foreground">
                                    Registro de vacunaciones y recordatorios automáticos para mantener a las mascotas protegidas
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-accent rounded-lg p-2">
                                <Clock className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Reportes</h3>
                                <p className="text-sm text-muted-foreground">
                                    Genera reportes detallados sobre la salud y el historial de vacunación de las mascotas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección derecha - Formulario */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-card/80 backdrop-blur-sm border-l border-border/20">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-muted-foreground">
                            Ingresa tus credenciales para acceder al sistema
                        </p>
                    </div>
                    <LoginForm />

                    {/* Información adicional */}
                    <div className="mt-8 text-center space-y-4">
                        <div className="border-t border-border pt-6">
                            <p className="text-sm text-muted-foreground">
                                ¿Problemas para ingresar?
                            </p>
                            <p className="text-sm text-primary font-medium cursor-pointer hover:underline">
                                <a href="https://wa.me/+51992450988" target="_blank">Contacta al administrador del sistema</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;