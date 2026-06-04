"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CreditCard, UserPlus } from "lucide-react";
import { useCreateVeterinario } from "../hooks/useVet";
import { CreateVeterinarioRequest } from "../types";

interface RegisterFormProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const RegisterFormModal = ({ trigger, open, onOpenChange }: RegisterFormProps) => {
    const [formData, setFormData] = useState<CreateVeterinarioRequest>({
        name: "",
        email: "",
        password: "",
        phone: "",
        dni: "",
        address: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const createVetMutation = useCreateVeterinario();

    const handleOpenChange = (openState: boolean) => {
        setIsOpen(openState);
        onOpenChange?.(openState);
        if (!openState) {
            setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
                dni: "",
                address: ""
            });
            setShowPassword(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createVetMutation.mutateAsync(formData);
            handleOpenChange(false);
        } catch {
            // Error handling is managed by the hook's onError
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Dialog open={open ?? isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Registrar Usuario
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <VisuallyHidden>
                    <DialogTitle>Registrar Veterinario</DialogTitle>
                </VisuallyHidden>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">Registrar Usuario</h2>
                    <p className="text-muted-foreground mt-1">
                        Completa todos los campos para registrar un nuevo veterinario
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dni"
                                    name="dni"
                                    type="text"
                                    placeholder="12345678"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="veterinario@email.com"
                                value={formData.email}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="987654321"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Av. Principal 123"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createVetMutation.isPending}
                    >
                        {createVetMutation.isPending ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Registrando...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Registrar Usuario
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};