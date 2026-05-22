import { Stat } from "../types";

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="bg-linear-to-br from-primary to-primary/90 rounded-3xl p-8 lg:p-16 text-primary-foreground shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Cifras del sistema municipal
          </h2>
          <p className="text-lg opacity-90">
            Mascotas registradas y atenciones realizadas a través del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
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
  );
}