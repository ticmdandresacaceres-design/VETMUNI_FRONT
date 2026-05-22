import PacienteDetailPage from "@/src/features/patients/components/PacienteDetailPage";

export default function PacienteDetail({ params }: { params: Promise<{ id: string }> }) {
  return <PacienteDetailPage params={params} />;
}
