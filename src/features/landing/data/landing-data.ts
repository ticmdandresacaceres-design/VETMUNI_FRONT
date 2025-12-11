import {
  Shield,
  Syringe,
  Stethoscope,
  FileText,
  Bell,
  Heart,
  Users,
  QrCode,
  PawPrint,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Campaign, Benefit, Step, Stat, Feature } from "../types";

export const campaigns: Campaign[] = [
  {
    title: "Campaña de Vacunación",
    subtitle: "Diciembre 2025",
    description: "Vacuna antirrábica gratuita para todas las mascotas registradas",
    date: "Todo el mes",
    badge: "Activa",
    image: "/images/campains/vacunacion.webp"
  },
  {
    title: "Registro Gratuito",
    subtitle: "Promoción Especial",
    description: "Registra a tu mascota sin costo durante este mes",
    date: "Hasta el 30 Dic",
    badge: "Última semana",
    image: "/images/campains/registro.webp"
  },
  {
    title: "Esterilización a Bajo Costo",
    subtitle: "Campaña Municipal",
    description: "Programa de esterilización con descuento del 70%",
    date: "Próximamente",
    badge: "Próxima",
    image: "/images/campains/esterilizacion.webp"
  }
  
];

export const benefits: Benefit[] = [
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
];

export const steps: Step[] = [
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
];

export const stats: Stat[] = [
  { icon: PawPrint, number: "247", label: "Mascotas Registradas" },
  { icon: Syringe, number: "636", label: "Vacunas Aplicadas" },
  { icon: Users, number: "350", label: "Familias Beneficiadas" },
  { icon: TrendingUp, number: "98%", label: "Satisfacción" }
];

export const features: Feature[] = [
  { icon: Shield, title: "Sistema", subtitle: "Seguro" },
  { icon: Clock, title: "Atención", subtitle: "Rápida" },
  { icon: Stethoscope, title: "Servicio", subtitle: "Profesional" },
  { icon: Heart, title: "Trato", subtitle: "Humanizado" }
];

export const commitments = [
  "Control y prevención de enfermedades",
  "Programas de vacunación masiva",
  "Atención veterinaria accesible",
  "Educación sobre tenencia responsable"
];

export const contactInfo = {
  address: "Av. Municipal 1234, Centro",
  phone: "+51 999 888 777",
  schedule: "Lun - Sáb: 8am - 6pm",
  mapsUrl: "https://maps.app.goo.gl/o29Gc7u94fRvaxxZ9"
};