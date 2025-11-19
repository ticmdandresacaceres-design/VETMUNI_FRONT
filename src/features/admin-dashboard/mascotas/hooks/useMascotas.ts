import { useState, useCallback } from 'react';
import { findAll, findById, create, update, remove, search, filter, getPage } from '../services/MascotaService';
import { MascotaDetails, MascotaNewRequest, MascotaUpdateRequest, MascotaCreateResponse, MascotaUpdateResponse, MascotaDeleteResponse, MascotaPageDetails } from '../types';
import { toast } from "sonner";

// Definición de la interfaz para el hook useMascotas
interface UseMascotasReturn {
    mascotas: MascotaDetails[];
    mascotaPage: MascotaPageDetails | null;
    loading: boolean;
    error: string | null;
    getMascotas: () => Promise<void>;
    getMascotaById: (id: string) => Promise<MascotaDetails | null>;
    getMascotaPage: (mascotaId: string) => Promise<MascotaPageDetails | null>;
    createMascota: (payload: MascotaNewRequest) => Promise<boolean>;
    updateMascota: (id: string, payload: MascotaUpdateRequest) => Promise<boolean>;
    deleteMascota: (id: string) => Promise<boolean>;
    searchMascotas: (term: string) => Promise<void>;
    filterMascotas: (especie?: string, sexo?: string, raza?: string) => Promise<void>;
    clearError: () => void;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Ocurrió un error inesperado';
}

const useMascotas = (): UseMascotasReturn => {

    // Estado para mascotas, carga y errores
    const [mascotas, setMascotas] = useState<MascotaDetails[]>([]);
    const [mascotaPage, setMascotaPage] = useState<MascotaPageDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para limpiar errores
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Funciones CRUD y de búsqueda
    const getMascotas = useCallback(async (): Promise<void> => {
        setLoading(true);
        clearError();
        try {
            const data = await findAll();
            setMascotas(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar mascotas: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Obtener mascota por ID
    const getMascotaById = useCallback(async (id: string): Promise<MascotaDetails | null> => {
        setLoading(true);
        clearError();
        try {
            const data = await findById(id);
            return data;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar la mascota: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Obtener página completa de una mascota con todos sus detalles
    const getMascotaPage = useCallback(async (mascotaId: string): Promise<MascotaPageDetails | null> => {
        setLoading(true);
        clearError();
        try {
            const data = await getPage(mascotaId);
            setMascotaPage(data);
            return data;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar los detalles de la mascota: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Crear nueva mascota
    const createMascota = useCallback(async (payload: MascotaNewRequest): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: MascotaCreateResponse = await create(payload);

            if (response.success) {
                await getMascotas();
                toast.success(`La mascota ${payload.nombre} ha sido creada exitosamente`);
                return true;
            }

            const message = response.message || 'Error al crear la mascota';
            setError(message);
            toast.error(message);
            return false;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearError, getMascotas]);

    const updateMascota = useCallback(async (id: string, payload: MascotaUpdateRequest): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: MascotaUpdateResponse = await update(payload, id);

            if (response.success) {
                const updatedMascota = await findById(id);
                if (updatedMascota) {
                    setMascotas(prev => prev.map(mascota =>
                        mascota.id === id ? updatedMascota : mascota
                    ));
                } else {
                    await getMascotas();
                }
                toast.success(`Los datos de ${payload.nombre} han sido actualizados correctamente`);
                return true;
            }

            const message = response.message || 'Error al actualizar la mascota';
            setError(message);
            toast.error(message);
            return false;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearError, getMascotas]);

    const deleteMascota = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: MascotaDeleteResponse = await remove(id);

            if (response.success) {
                setMascotas(prev => prev.filter(mascota => mascota.id !== id));
                toast.success("La mascota ha sido eliminada exitosamente");
                return true;
            }

            const message = response.message || 'Error al eliminar la mascota';
            setError(message);
            toast.error(message);
            return false;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    const searchMascotas = useCallback(async (term: string): Promise<void> => {
        if (!term.trim()) {
            await getMascotas();
            return;
        }

        setLoading(true);
        clearError();
        try {
            const data = await search(term);
            setMascotas(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al buscar mascotas: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [getMascotas, clearError]);

    const filterMascotas = useCallback(async (especie?: string, sexo?: string, raza?: string): Promise<void> => {
        if (!especie && !sexo && !raza) {
            await getMascotas()
            return
        }

        setLoading(true);
        clearError();
        try {
            const data = await filter(especie, sexo, raza);
            setMascotas(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al filtrar mascotas: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [getMascotas, clearError]);

    return {
        // Estados 
        mascotas,
        mascotaPage,
        loading,
        error,
        // Métodos
        getMascotas,
        getMascotaById,
        getMascotaPage,
        createMascota,
        updateMascota,
        deleteMascota,
        searchMascotas,
        filterMascotas,
        clearError,
    };
};

export default useMascotas;