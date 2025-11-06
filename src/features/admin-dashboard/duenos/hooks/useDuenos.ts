import { useState, useCallback } from 'react';
import { findAll, findById, create, updateIgnorePasswordAndLocation, remove, searchTerm } from '../service/DuenoService';
import { DuenoDetails, DuenoNewRequest, DuenoUpdateIgnorePasswordAndLocation, DuenoCreateResponse, DuenoUpdateResponse, DuenoDeleteResponse } from '../types';
import { toast } from "sonner";

// Definición de la interfaz para el hook useDuenos
interface UseDuenosReturn {
    duenos: DuenoDetails[];
    loading: boolean;
    error: string | null;
    getDuenos: () => Promise<void>;
    getDuenoById: (id: string) => Promise<DuenoDetails | null>;
    createDueno: (payload: DuenoNewRequest) => Promise<boolean>;
    updateDueno: (id: string, payload: DuenoUpdateIgnorePasswordAndLocation) => Promise<boolean>;
    deleteDueno: (id: string) => Promise<boolean>;
    searchDuenos: (term: string) => Promise<void>;
    clearError: () => void;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Ocurrió un error inesperado';
}

const useDuenos = (): UseDuenosReturn => {

    // Estado para dueños, carga y errores
    const [duenos, setDuenos] = useState<DuenoDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para limpiar errores
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Funciones CRUD y de búsqueda
    const getDuenos = useCallback(async (): Promise<void> => {
        setLoading(true);
        clearError();
        try {
            const data = await findAll();
            setDuenos(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar dueños: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Obtener dueño por ID
    const getDuenoById = useCallback(async (id: string): Promise<DuenoDetails | null> => {
        setLoading(true);
        clearError();
        try {
            const data = await findById(id);
            return data;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al cargar el dueño: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [clearError]);

    // Crear nuevo dueño
    const createDueno = useCallback(async (payload: DuenoNewRequest): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: DuenoCreateResponse = await create(payload);

            if (response.success) {
                // Como el backend no retorna data, recarga la lista
                await getDuenos();
                toast.success(`El dueño ${payload.nombre} ha sido creado exitosamente`);
                return true;
            }

            const message = response.message || 'Error al crear el dueño';
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
    }, [clearError, getDuenos]);

    const updateDueno = useCallback(async (id: string, payload: DuenoUpdateIgnorePasswordAndLocation): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: DuenoUpdateResponse = await updateIgnorePasswordAndLocation(payload, id);

            if (response.success) {
                // Como el backend no retorna data, obtén los datos actualizados
                const updatedDueno = await findById(id);
                if (updatedDueno) {
                    setDuenos(prev => prev.map(dueno => 
                        dueno.id === id ? updatedDueno : dueno
                    ));
                } else {
                    // Si no se puede obtener el dueño actualizado, recarga toda la lista
                    await getDuenos();
                }
                toast.success(`Los datos de ${payload.nombre} han sido actualizados correctamente`);
                return true;
            }

            const message = response.message || 'Error al actualizar el dueño';
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
    }, [clearError, getDuenos]);

    const deleteDueno = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        clearError();
        try {
            const response: DuenoDeleteResponse = await remove(id);

            if (response.success) {
                setDuenos(prev => prev.filter(dueno => dueno.id !== id));
                toast.success("El dueño ha sido eliminado exitosamente");
                return true;
            }

            const message = response.message || 'Error al eliminar el dueño';
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

    const searchDuenos = useCallback(async (term: string): Promise<void> => {
        if (!term.trim()) {
            await getDuenos();
            return;
        }

        setLoading(true);
        clearError();
        try {
            const data = await searchTerm(term);
            setDuenos(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            setError(message);
            toast.error(`Error al buscar dueños: ${message}`);
        } finally {
            setLoading(false);
        }
    }, [getDuenos, clearError]);

    return {
        // Estados 
        duenos,
        loading,
        error,
        // Métodos
        getDuenos,
        getDuenoById,
        createDueno,
        updateDueno,
        deleteDueno,
        searchDuenos,
        clearError,
    };
};

export default useDuenos;