import { useState, useCallback } from 'react';
import { findAll, findById, create, filterByType, findByDateRange } from '../service/VacunaService';
import { VacunaDetails, VacunaNewRequest, VacunaCreateResponse } from '../types';
import { toast } from "sonner";

// Definición de la interfaz para el hook useVacunas
interface UseVacunasReturn {
    vacunas: VacunaDetails[];
    loading: boolean;
    error: string | null;
    getVacunas: () => Promise<void>;
    getVacunaById: (id: string) => Promise<VacunaDetails | null>;
    createVacuna: (payload: VacunaNewRequest) => Promise<boolean>;
    filterVacunasByType: (type: string) => Promise<void>;
    filterVacunasByDateRange: (startDate: string, endDate: string) => Promise<void>;
    clearError: () => void;
    getMascotaNames: () => string[];
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Ocurrió un error inesperado';
}

const useVacunas = (): UseVacunasReturn => {

    // Estado para vacunas, carga y errores
    const [vacunas, setVacunas] = useState<VacunaDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para limpiar errores
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // función para obtener nombres de mascotas únicas
    const getMascotaNames = useCallback((): string[] => {
        const mascotasUnicas = Array.from(new Set(vacunas.map(vacuna => vacuna.mascota)));
        return mascotasUnicas.filter(nombre => nombre && nombre.trim() !== '');
    }, [vacunas]);

    // Obtener todas las vacunas
    const getVacunas = useCallback(async (): Promise<void> => {
        setLoading(true);
        clearError();
        try {
            const data = await findAll();
            setVacunas(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar vacunas: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Obtener vacuna por ID
    const getVacunaById = useCallback(async (id: string): Promise<VacunaDetails | null> => {
        setLoading(true);
        clearError();
        try {
            const data = await findById(id);
            return data;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar la vacuna: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Crear nueva vacuna
    const createVacuna = useCallback(async (payload: VacunaNewRequest): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: VacunaCreateResponse = await create(payload);

            if (response.success) {
                await getVacunas();
                toast.success(`La vacuna ${payload.tipo} ha sido creada exitosamente`);
                return true;
            }

            const message = response.message || 'Error al crear la vacuna';
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
    }, [clearError, getVacunas]);

    // Filtrar vacunas por tipo
    const filterVacunasByType = useCallback(async (type: string): Promise<void> => {
        if (!type.trim()) {
            await getVacunas();
            return;
        }

        setLoading(true);
        clearError();
        try {
            const data = await filterByType(type);
            setVacunas(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al filtrar vacunas por tipo: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [getVacunas, clearError]);

    // Filtrar vacunas por rango de fechas
    const filterVacunasByDateRange = useCallback(async (startDate: string, endDate: string): Promise<void> => {
        if (!startDate || !endDate) {
            await getVacunas();
            return;
        }

        setLoading(true);
        clearError();
        try {
            const data = await findByDateRange(startDate, endDate);
            setVacunas(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al filtrar vacunas por rango de fechas: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [getVacunas, clearError]);

    return {
        // Estados 
        vacunas,
        loading,
        error,
        // Métodos
        getVacunas,
        getVacunaById,
        createVacuna,
        filterVacunasByType,
        filterVacunasByDateRange,
        clearError,
        getMascotaNames,
    };
};

export default useVacunas;