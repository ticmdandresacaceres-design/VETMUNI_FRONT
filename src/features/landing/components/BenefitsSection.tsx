import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Benefit } from "../types";

interface BenefitsSectionProps {
  benefits: Benefit[];
}

export function BenefitsSection({ benefits }: BenefitsSectionProps) {
  return (
    <section id="beneficios" className="container mx-auto px-6 py-20 scroll-mt-20">
      <div className="text-center mb-16">
        <Badge className="mb-4 text-sm px-4 py-1">Beneficios del Sistema</Badge>
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">
          Beneficios del Sistema
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Un sistema de gestión integral que permite a la municipalidad llevar un control
          ordenado de la población animal y brindar una mejor atención a los vecinos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
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
  );
}