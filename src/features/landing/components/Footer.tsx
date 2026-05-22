import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="border-t py-12 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Logo Municipalidad */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="relative h-20 w-full max-w-[280px]">
                            <Image
                                src="/images/landing/logo-muni.webp"
                                alt="Municipalidad Distrital Andrés Avelino Cáceres Dorregaray"
                                fill
                                sizes="(max-width: 768px) 100vw, 280px"
                                className="object-contain object-center md:object-left"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            Registro de Mascotas Municipal
                        </p>
                    </div>

                    {/* Logo Alcalde */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative h-20 w-full max-w-60">
                            <Image
                                src="/images/landing/logo-alcalde.webp"
                                alt="Alcalde Edwin Gavilán"
                                fill
                                sizes="(max-width: 768px) 100vw, 240px"
                                className="object-contain"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Alcalde
                        </p>
                    </div>

                    {/* Logo Gestión */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="relative h-20 w-full max-w-[200px]">
                            <Image
                                src="/images/landing/logo-gestion.webp"
                                alt="Gestión Para Todos"
                                fill
                                sizes="(max-width: 768px) 100vw, 200px"
                                className="object-contain object-center md:object-right bg-gray-800 "
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center md:text-right">
                            Gestión Para Todos
                        </p>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Municipalidad Distrital Andrés Avelino Cáceres Dorregaray
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Todos los derechos reservados
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex gap-3">
                                <Button variant="link" size="sm">
                                    <a href="https://www.gob.pe/anpd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        Términos <ExternalLink className="h-3 w-3" />
                                    </a>
                                </Button>
                                <Button variant="link" size="sm">
                                    <a href="https://www.gob.pe/anpd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        Privacidad <ExternalLink className="h-3 w-3" />
                                    </a>
                                </Button>
                                <Button onClick={() => window.location.href = '/login'} variant="link" size="sm">
                                    Iniciar sesión
                                </Button>
                            </div>

                            <a 
                                href="https://github.com/devBryan02" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                title="Desarrollador del Sistema"
                                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                <span className="font-medium">devBryan02</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}