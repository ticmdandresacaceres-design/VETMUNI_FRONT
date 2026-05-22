"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, LogIn } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section id="hero" className="container mx-auto px-6 py-8 scroll-mt-20">
      <div className="relative rounded-3xl overflow-hidden h-[450px] lg:h-[550px] shadow-2xl">
        <Image
          src="/images/campains/vacunacion.webp"
          alt="Sistema de Gestión Veterinaria Municipal"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={90}
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40"></div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtOC44MzctNy4xNjMtMTYtMTYtMTZTNCAxNC4xNjMgNCAxNHM3LjE2MyAxNiAxNiAxNiAxNi03LjE2MyAxNi0xNnpNIDAgMTRjMC03LjczMiA2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNC0xNC02LjI2OC0xNC0xNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative h-full flex flex-col justify-center px-8 lg:px-16 text-white">
          <Badge variant="secondary" className="w-fit mb-6 shadow-md">
            <Shield className="h-4 w-4 mr-2" />
            Municipalidad Distrital Andrés Avelino Cáceres Dorregaray
          </Badge>

          <p className="text-lg mb-2 font-medium text-white/90">Sistema de Gestión Veterinaria Municipal</p>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 max-w-2xl leading-tight drop-shadow-lg">
            Control y bienestar animal para nuestra comunidad
          </h1>

          <p className="text-xl lg:text-2xl mb-4 max-w-xl leading-relaxed text-white/90 drop-shadow-md">
            Un sistema integral para el registro, control y seguimiento de mascotas,
            facilitando la gestión municipal y el cuidado de los animales del distrito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90">
              <MapPin className="h-5 w-5" />
              <a href="https://maps.app.goo.gl/o29Gc7u94fRvaxxZ9" target="_blank" rel="noopener noreferrer">
                Visítanos
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/40 hover:bg-white/20 shadow-md gap-2"
              onClick={() => window.location.href = '/login'}
            >
              <LogIn className="h-5 w-5" />
              Acceso al Sistema
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
