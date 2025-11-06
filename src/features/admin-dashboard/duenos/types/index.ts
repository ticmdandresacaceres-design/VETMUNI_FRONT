import { CreateResponse, UpdateResponse, DeleteResponse } from '@/src/lib/api/types';

export type DuenoNewRequest = {
    nombre: string;
    DNI: string;
    direccion: string;
    telefono: string;
    correo: string;
    password: string;
    latitud: string;
    longitud: string;
};

export type DuenoDetails = {
    id: string;
    nombre: string;
    DNI: string;
    direccion: string;
    telefono: string;
    correo: string;
    cantidadMascota: number;
}

export type DuenoUpdateIgnorePasswordAndLocation = {
    nombre: string;
    DNI: string;
    direccion: string;
    telefono: string;
    correo: string;
};

// Tipos de respuesta específicos para Dueño
export type DuenoCreateResponse = CreateResponse<DuenoDetails>;
export type DuenoUpdateResponse = UpdateResponse<DuenoDetails>;
export type DuenoDeleteResponse = DeleteResponse;