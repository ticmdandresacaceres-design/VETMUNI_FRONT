"use client";

import { use } from "react";
import PacienteDetail from "./PacienteDetail";

export default function PacienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PacienteDetail petId={id} />;
}
