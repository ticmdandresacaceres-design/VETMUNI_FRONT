"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Award, ListChecks, Users, Mail, LogIn } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer relative h-12 w-48 hover:opacity-80 transition-opacity" 
            onClick={() => handleNavigation('hero')}
          >
            <Image
              src="/images/landing/logo-muni.webp"
              alt="Logo Municipalidad Veterinaria"
              fill
              sizes="192px"
              className="object-contain object-left"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" onClick={() => handleNavigation('hero')} className="gap-2">
              <Home className="h-4 w-4" />
              Inicio
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('beneficios')} className="gap-2">
              <Award className="h-4 w-4" />
              Beneficios
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('como-funciona')} className="gap-2">
              <ListChecks className="h-4 w-4" />
              Cómo Funciona
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('nosotros')} className="gap-2">
              <Users className="h-4 w-4" />
              Nosotros
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('contacto')} className="gap-2">
              <Mail className="h-4 w-4" />
              Contacto
            </Button>
            <Button onClick={() => window.location.href = '/login'} className="ml-2 gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-2 mt-4 pb-4 border-t pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleNavigation('hero')}>
              <Home className="h-4 w-4" />
              Inicio
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleNavigation('beneficios')}>
              <Award className="h-4 w-4" />
              Beneficios
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleNavigation('como-funciona')}>
              <ListChecks className="h-4 w-4" />
              Cómo Funciona
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleNavigation('nosotros')}>
              <Users className="h-4 w-4" />
              Nosotros
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => handleNavigation('contacto')}>
              <Mail className="h-4 w-4" />
              Contacto
            </Button>
            <Button onClick={() => window.location.href = '/login'} className="w-full mt-2 gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}