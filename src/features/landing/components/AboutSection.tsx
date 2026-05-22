import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Feature } from "../types";

interface AboutSectionProps {
  commitments: string[];
  features: Feature[];
}

export function AboutSection({ commitments, features }: AboutSectionProps) {
  return (
    <section id="nosotros" className="bg-muted/50 py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-6 text-sm px-4 py-1">Nuestro Compromiso</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Un sistema al servicio del distrito
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Este sistema de gestión veterinaria permite a la municipalidad centralizar
              la información de la población animal, optimizar los recursos y brindar
              un servicio más eficiente a todos los vecinos del distrito.
            </p>
            
            <div className="space-y-4">
              {commitments.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <CheckCircle className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
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
  );
}