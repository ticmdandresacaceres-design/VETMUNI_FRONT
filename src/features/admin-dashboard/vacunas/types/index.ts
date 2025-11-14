import { CreateResponse, DeleteResponse } from "@/src/lib/api/types";

export type VacunaNewRequest = {
    tipo: string;
    fechaAplicacion: string;
    mascotaId: string;
    mesesVigencia: number;
    fechaVencimiento: string;
    proximaDosis: string;
}

export type VacunaDetails = {
    id: string;
    tipo: string;
    fechaaplicacion: string;
    mascota: string;
    mesesvigencia: number;
    fechavencimiento: string;
    proximadosis: string;
}

// Tipo de respuesta espicifico para eliminar
export type VacunaCreateResponse = CreateResponse<VacunaDetails>;
export type VacunaDeleteResponse = DeleteResponse;
