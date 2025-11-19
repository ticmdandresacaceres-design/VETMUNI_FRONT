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

export type ImagenResume = {
    id: string;
    url: string;
    descripcion: string;
    fechaSubida: string;
}

export type DuenoResume = {
    id: string;
    nombre: string;
    telefono: string;
    correo: string;
}

export type VacunaResume = {
    id: string;
    tipo: string;
    fechaAplicacion: string;
    fechaVencimiento: string;
}

export type VacunaDetails = {
    totalVacunas: number;
    vacunaslist: VacunaResume[];
}

export type MascotaPageDetails = {
    id: string;
    nombre: string;
    especie: string;
    raza: string;
    edad: string;
    sexo: string;
    color: string;
    identificador: string;
    fotoUrl: string;
    estado: string;
    imagenList: ImagenResume[];
    dueno: DuenoResume;
    vacuna: VacunaDetails;
    fechaCreacion: string;
}


