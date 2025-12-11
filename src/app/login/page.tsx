"use client";

import { Button } from "@/components/ui/button";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { Shield, Clock, Users, ArrowLeft } from "lucide-react";
import Image from "next/image";

function LoginPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-primary/5 flex flex-col lg:flex-row">
            {/* Sección izquierda - Información */}
            <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
                <div className="max-w-lg mx-auto lg:mx-0">
                    {/* Logo municipalidad */}
                    <div className="text-center lg:text-left mb-8">
                        <div className="flex items-center justify-center lg:justify-start mb-6">
                            <div className="relative h-24 w-full max-w-[320px]">
                                <Image
                                    src="/images/landing/logo-muni.webp"
                                    alt="Municipalidad Distrital Andrés Avelino Cáceres Dorregaray"
                                    fill
                                    className="object-contain object-center lg:object-left"
                                    priority
                                />
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Registro de Mascotas Municipal
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
                            <div className="bg-primary/10 rounded-lg p-2">
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
                            <div className="bg-primary/10 rounded-lg p-2">
                                <Clock className="h-5 w-5 text-primary" />
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
                    <div className="mt-4 text-center space-y-4">
                        <div className="border-t border-border pt-6">
                            <p className="text-sm text-muted-foreground">
                                ¿Problemas para ingresar?
                            </p>
                            <p className="text-sm text-primary font-medium cursor-pointer hover:underline">
                                <a href="https://wa.me/+51992450988" target="_blank" rel="noopener noreferrer">
                                    Contacta al administrador del sistema
                                </a>
                            </p>
                        </div>
                        <div>
                            <Button variant="ghost" onClick={() => window.location.href="/"}>
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Volver al sitio web
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;