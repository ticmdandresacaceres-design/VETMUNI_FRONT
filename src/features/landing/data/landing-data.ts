import {
  Shield,
  Syringe,
  Stethoscope,
  FileText,
  Bell,
  QrCode,
  Users,
  PawPrint,
  TrendingUp,
  Clock,
  Map,
  Database,
} from "lucide-react";
import { Benefit, Step, Stat, Feature } from "../types";

export const benefits: Benefit[] = [
  {
    icon: Shield,
    title: "Registro Oficial Municipal",
    description: "Cada mascota obtiene un carnet digital con código QR único, respaldado por el municipio."
  },
  {
    icon: Syringe,
    title: "Control de Vacunación",
    description: "Seguimiento del calendario de vacunación con alertas automáticas para mantener al día a cada mascota."
  },
  {
    icon: Stethoscope,
    title: "Atención Veterinaria",
    description: "Servicios de consulta, diagnóstico y tratamiento en el centro de atención municipal."
  },
  {
    icon: FileText,
    title: "Historial Clínico Digital",
    description: "Registro completo del historial médico de cada mascota, accesible en todo momento."
  },
  {
    icon: Bell,
    title: "Recordatorio Automático",
    description: "El sistema notifica a los propietarios cuando una mascota requiere vacuna o control."
  },
  {
    icon: Database,
    title: "Gestión Municipal Centralizada",
    description: "Base de datos unificada que permite a la municipalidad llevar un control ordenado de la población animal."
  }
];

export const steps: Step[] = [
  {
    step: "1",
    icon: Users,
    title: "Visita el Centro Municipal",
    description: "Acércate a nuestras oficinas con tu mascota para iniciar el proceso"
  },
  {
    step: "2",
    icon: FileText,
    title: "Registro en el Sistema",
    description: "El personal municipal registra los datos de la mascota y su propietario"
  },
  {
    step: "3",
    icon: QrCode,
    title: "Carnet Digital",
    description: "Recibes un carnet con código QR que identifica a tu mascota oficialmente"
  },
  {
    step: "4",
    icon: Bell,
    title: "Seguimiento Continuo",
    description: "El sistema te mantiene informado sobre vacunas y controles pendientes"
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
  { icon: Clock, title: "Atención", subtitle: "Eficiente" },
  { icon: Stethoscope, title: "Servicio", subtitle: "Profesional" },
  { icon: Map, title: "Cobertura", subtitle: "Distrital" }
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
