import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Step } from "../types";

interface HowItWorksSectionProps {
  steps: Step[];
  onNavigate: (sectionId: string) => void;
}

export function HowItWorksSection({ steps, onNavigate }: HowItWorksSectionProps) {
  return (
    <section id="como-funciona" className="bg-muted/50 py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-1">Proceso de Registro</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            ¿Cómo funciona el sistema?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            El proceso de registro y seguimiento de mascotas es ágil y ordenado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                  <step.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 right-0 left-0 mx-auto w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="gap-2 shadow-lg" onClick={() => onNavigate('contacto')}>
            <MapPin className="h-5 w-5" />
            Visítanos para Registrar a tu Mascota
          </Button>
        </div>
      </div>
    </section>
  );
}