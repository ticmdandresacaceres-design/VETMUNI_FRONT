"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";
import { LoginRequest } from "../types";

export const LoginForm = () => {
    const [formData, setFormData] = useState<LoginRequest>({
        correo: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthContext();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await login(formData);
            toast.success(`¡Bienvenido de nuevo, ${response.user.nombre}!`);
            // Redirigir según el rol del usuario
            const userRoles = response.user.roles;
            
            if (userRoles.includes("ADMIN")) {
                router.push("/dashboard/admin");
            } else if (userRoles.includes("VETERINARIA")) {
                router.push("/dashboard/veterinaria");
            } else {
                // Rol por defecto o sin roles específicos
                router.push("/dashboard");
            }
            
        } catch (error: any) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="correo">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="correo"
                                name="correo"
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.correo}
                                onChange={handleChange}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 pr-10"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Iniciar Sesión
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};