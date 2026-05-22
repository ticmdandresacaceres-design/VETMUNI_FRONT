import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock, Heart } from "lucide-react";

interface ContactInfo {
  address: string;
  phone: string;
  schedule: string;
  mapsUrl: string;
}

interface ContactSectionProps {
  contactInfo: ContactInfo;
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  return (
    <section id="contacto" className="container mx-auto px-6 py-20 scroll-mt-20">
      <Card className="overflow-hidden shadow-2xl">
        <div className="bg-linear-to-r from-primary via-primary to-primary/90 p-8 lg:p-16 text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Visita nuestro centro municipal
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Acércate a nuestras oficinas para registrar a tu mascota y conocer más sobre el sistema
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary-foreground/20 transition-colors">
                <MapPin className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Dirección</p>
                <p className="text-sm opacity-90">{contactInfo.address}</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary-foreground/20 transition-colors">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Teléfono</p>
                <p className="text-sm opacity-90">{contactInfo.phone}</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover:bg-primary-foreground/20 transition-colors">
                <Clock className="h-8 w-8 mx-auto mb-3" />
                <p className="font-semibold mb-1">Horario</p>
                <p className="text-sm opacity-90">{contactInfo.schedule}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                <MapPin className="h-5 w-5" />
                <a href={contactInfo.mapsUrl} target="_blank" rel="noopener noreferrer">
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
              Sistema de Gestión Veterinaria - Municipalidad Distrital Andrés Avelino Cáceres Dorregaray
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}