"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Heart, 
  Stethoscope, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Shield,
  CheckCircle,
  Syringe,
  FileText,
  PawPrint,
  QrCode,
  Bell,
  Users,
  TrendingUp,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const campaigns = [
    {
      title: "Campaña de Vacunación Gratuita",
      subtitle: "Noviembre 2024",
      description: "Vacuna antirrábica gratuita para todas las mascotas registradas",
      date: "Todo el mes",
      badge: "Activa"
    },
    {
      title: "Registro Gratuito",
      subtitle: "Promoción Especial",
      description: "Registra a tu mascota sin costo durante este mes",
      date: "Hasta el 30 Nov",
      badge: "Última semana"
    },
    {
      title: "Esterilización a Bajo Costo",
      subtitle: "Campaña Municipal",
      description: "Programa de esterilización con descuento del 70%",
      date: "Próximamente",
      badge: "Próxima"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <PawPrint className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold">VetRegistry</span>
                <p className="text-xs text-muted-foreground">Municipalidad Veterinaria</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => scrollToSection('hero')}>
                Inicio
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection('beneficios')}>
                Beneficios
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection('como-funciona')}>
                Cómo Funciona
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection('nosotros')}>
                Nosotros
              </Button>
              <Button variant="ghost" onClick={() => scrollToSection('contacto')}>
                Contacto
              </Button>
              <Button onClick={() => window.location.href = '/login'} className="ml-2">
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
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('hero')}>
                Inicio
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('beneficios')}>
                Beneficios
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('como-funciona')}>
                Cómo Funciona
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('nosotros')}>
                Nosotros
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('contacto')}>
                Contacto
              </Button>
              <Button onClick={() => window.location.href = '/login'} className="w-full mt-2">
                Iniciar Sesión
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Carousel - Campaigns */}
      <section id="hero" className="container mx-auto px-6 py-8 scroll-mt-20">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {campaigns.map((campaign, index) => (
              <CarouselItem key={index}>
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 h-[450px] lg:h-[550px] shadow-2xl">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtOC44MzctNy4xNjMtMTYtMTYtMTZTNCAxNC4xNjMgNCAxNHM3LjE2MyAxNiAxNiAxNiAxNi03LjE2MyAxNi0xNnpNIDAgMTRjMC03LjczMiA2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNC0xNC02LjI2OC0xNC0xNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                  
                  <div className="relative h-full flex flex-col justify-center px-8 lg:px-16 text-primary-foreground">
                    <Badge variant="secondary" className="w-fit mb-6 shadow-md animate-pulse">
                      <Bell className="h-4 w-4 mr-2" />
                      {campaign.badge}
                    </Badge>
                    
                    <p className="text-lg mb-2 opacity-90 font-medium">{campaign.subtitle}</p>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6 max-w-2xl leading-tight">
                      {campaign.title}
                    </h1>
                    
                    <p className="text-xl lg:text-2xl mb-4 max-w-xl opacity-90 leading-relaxed">
                      {campaign.description}
                    </p>
                    
                    <p className="text-lg mb-8 opacity-90 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {campaign.date}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" variant="secondary" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                        <MapPin className="h-5 w-5" />
                        <a href="https://maps.app.goo.gl/o29Gc7u94fRvaxxZ9" target="_blank" rel="noopener noreferrer">
                          Visítanos
                        </a>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 shadow-md"
                        onClick={() => scrollToSection('contacto')}
                      >
                        Más Información
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Why Register Section */}
      <section id="beneficios" className="container mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-1">Beneficios del Sistema</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            ¿Por qué registrar a tu mascota?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Servicios veterinarios 100% gratuitos para todos los vecinos. Solo necesitas 
            registrar a tu mascota una vez y acceder a todos los beneficios
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Carnet con QR Oficial",
              description: "Tu mascota tendrá un carnet digital con código QR único de identificación municipal."
            },
            {
              icon: Syringe,
              title: "Vacunación Gratuita",
              description: "Acceso a todas las campañas de vacunación antirrábica completamente gratis."
            },
            {
              icon: Stethoscope,
              title: "Atención Veterinaria Gratis",
              description: "Consultas, tratamientos y emergencias sin costo en nuestro centro municipal."
            },
            {
              icon: FileText,
              title: "Historial Completo",
              description: "Guardamos todo el historial médico de tu mascota en nuestro sistema."
            },
            {
              icon: Bell,
              title: "Te Avisamos",
              description: "Nosotros te recordamos cuando es hora de vacunas o controles."
            },
            {
              icon: Heart,
              title: "100% Gratuito",
              description: "Todos los servicios veterinarios municipales son completamente gratis."
            }
          ].map((benefit, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <benefit.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="bg-muted/50 py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 text-sm px-4 py-1">Proceso Simple</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Registrar a tu mascota es fácil y rápido. Sigue estos 4 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: "1",
                icon: Users,
                title: "Visita el Centro",
                description: "Acércate a nuestra oficina municipal con tu mascota"
              },
              {
                step: "2",
                icon: FileText,
                title: "Completa el Registro",
                description: "Llena un formulario simple con los datos de tu mascota"
              },
              {
                step: "3",
                icon: QrCode,
                title: "Recibe tu Carnet",
                description: "Obtén el carnet digital con QR de identificación"
              },
              {
                step: "4",
                icon: Heart,
                title: "Recibe Atención Gratis",
                description: "Trae a tu mascota cuando necesite. Todo es gratis"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 left-0 right-0 mx-auto w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="gap-2 shadow-lg" onClick={() => scrollToSection('contacto')}>
              <Calendar className="h-5 w-5" />
              Visítanos para Registrar
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              El registro es presencial y completamente gratis
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 lg:p-16 text-primary-foreground shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Vecinos que ya confían en nosotros
            </h2>
            <p className="text-lg opacity-90">
              Únete a nuestra comunidad de dueños responsables
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: PawPrint, number: "2,547", label: "Mascotas Registradas" },
              { icon: Syringe, number: "1,823", label: "Vacunas Aplicadas" },
              { icon: Users, number: "1,650", label: "Familias Beneficiadas" },
              { icon: TrendingUp, number: "98%", label: "Satisfacción" }
            ].map((stat, index) => (
              <div key={index} className="space-y-4 hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="opacity-90 text-sm lg:text-base">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section id="nosotros" className="bg-muted/50 py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 text-sm px-4 py-1">Nuestro Compromiso</Badge>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Cuidamos la salud de tus mascotas
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Como municipalidad, nos comprometemos a brindar servicios veterinarios 
                accesibles y de calidad para todas las familias de nuestra comunidad.
              </p>
              
              <div className="space-y-4">
                {[
                  "Control y prevención de enfermedades",
                  "Programas de vacunación masiva",
                  "Atención veterinaria accesible",
                  "Educación sobre tenencia responsable"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <CheckCircle className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Shield, title: "Sistema", subtitle: "Seguro" },
                { icon: Clock, title: "Atención", subtitle: "Rápida" },
                { icon: Stethoscope, title: "Servicio", subtitle: "Profesional" },
                { icon: Heart, title: "Trato", subtitle: "Humanizado" }
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1 hover:border-primary/50">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                      <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="text-xl font-bold mb-1">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">{feature.subtitle}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contacto" className="container mx-auto px-6 py-20 scroll-mt-20">
        <Card className="overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-primary via-primary to-primary/90 p-8 lg:p-16 text-primary-foreground">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                ¿Listo para registrar a tu mascota?
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Ven a registrar a tu mascota y accede a todos nuestros servicios veterinarios gratuitos
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary-foreground/20 transition-colors">
                  <MapPin className="h-8 w-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Dirección</p>
                  <p className="text-sm opacity-90">Av. Municipal 1234, Centro</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary-foreground/20 transition-colors">
                  <Phone className="h-8 w-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Teléfono</p>
                  <p className="text-sm opacity-90">+51 999 888 777</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary-foreground/20 transition-colors">
                  <Clock className="h-8 w-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Horario</p>
                  <p className="text-sm opacity-90">Lun - Sáb: 8am - 6pm</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                  <MapPin className="h-5 w-5" />
                  <a href="https://maps.app.goo.gl/o29Gc7u94fRvaxxZ9" target="_blank" rel="noopener noreferrer">
                    Cómo Llegar
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 gap-2 shadow-lg">
                  <Phone className="h-5 w-5" />
                  Consultar Horarios
                </Button>
              </div>
              <p className="text-sm mt-6 opacity-90 flex items-center justify-center gap-2">
                <Heart className="h-4 w-4" />
                Todos los servicios son 100% gratuitos para vecinos del distrito
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <PawPrint className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">VetRegistry</span>
                <p className="text-xs text-muted-foreground">Municipalidad Veterinaria</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-2">
                © 2024 VetRegistry Municipal. Todos los derechos reservados.
              </p>
              <div className="flex justify-center md:justify-end gap-4">
                <Button onClick={() => window.location.href = '/login'} variant="link" size="sm">
                  Iniciar sesión
                </Button>
                <Button variant="link" size="sm">Términos</Button>
                <Button variant="link" size="sm">Privacidad</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}