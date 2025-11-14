import { CreateResponse, UpdateResponse, DeleteResponse } from '@/src/lib/api/types';

export type MascotaNewRequest = {
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    temperamento: string;
    condicionReproductiva: string;
    color: string;
    duenoId: string;
    anios: number;
    meses: number;
}

export type MascotaDetails = {
    id: string;
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    sexo: string;
    temperamento: string;
    condicionreproductiva: string;
    color: string;
    dueno: string;
    identificador: string;
}

export type MascotaUpdateRequest = {
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    temperamento: string;
    condicionReproductiva: string;
    color: string;
    anios: number;
    meses: number;
};

// Tipos de respuesta específicos para Mascota
export type MascotaCreateResponse = CreateResponse<MascotaDetails>;
export type MascotaUpdateResponse = UpdateResponse<MascotaDetails>;
export type MascotaDeleteResponse = DeleteResponse;


