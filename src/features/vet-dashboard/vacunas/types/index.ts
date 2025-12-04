import { CreateResponse, DeleteResponse } from "@/src/lib/api/types";

export type VacunaNewRequest = {
    tipo: string;
    fechaAplicacion: string;
    mascotaId: string;
    mesesVigencia: number;
}

export type VacunaUpdateRequest = {
    tipo: string;
    fechaAplicacion: string;
    mesesVigencia: number;
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
export type VacunaUpdateResponse = CreateResponse<VacunaDetails>;
export type VacunaDeleteResponse = DeleteResponse;

