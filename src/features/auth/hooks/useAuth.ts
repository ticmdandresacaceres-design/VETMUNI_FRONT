import { useState, useEffect, useCallback } from 'react';
import { AuthState, LoginRequest, User } from '../types';
import * as AuthService from '../service/AuthService';
import { tokenStorage } from '@/src/lib/api/token-storage';
import { ApiError } from '@/src/lib/api/axios';

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true
    });

    // Inicializar estado de autenticación al montar el componente
    useEffect(() => {
        const initializeAuth = () => {
            const token = tokenStorage.getToken();
            const user = tokenStorage.getUser();
            
            setAuthState({
                user,
                token,
                isAuthenticated: !!(token && user),
                isLoading: false
            });
        };

        initializeAuth();
    }, []);

    // Función de login - SOLO maneja la sesión
    const login = useCallback(async (credentials: LoginRequest) => {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        try {
            const response = await AuthService.login(credentials);
            
            setAuthState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false
            });

            return response;
        } catch (error) {
            setAuthState(prev => ({ 
                ...prev, 
                isLoading: false 
            }));
            
            throw error;
        }
    }, []);

    // Función de logout
    const logout = useCallback(async () => {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        try {
            await AuthService.logout();
            
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
        } catch (error) {
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
            throw error;
        }
    }, []);

    // Función para verificar si el usuario tiene un rol específico
    const hasRole = useCallback((role: string): boolean => {
        return authState.user?.roles?.includes(role) || false;
    }, [authState.user]);

    // Función para verificar si el usuario tiene alguno de los roles especificados
    const hasAnyRole = useCallback((roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    }, [hasRole]);

    // Función para obtener el usuario actual
    const getCurrentUser = useCallback((): User | null => {
        return authState.user;
    }, [authState.user]);

    // Función para verificar si está autenticado
    const isAuthenticated = useCallback((): boolean => {
        return authState.isAuthenticated;
    }, [authState.isAuthenticated]);

    return {
        // Estado
        ...authState,
        
        // Funciones
        login,
        logout,
        hasRole,
        hasAnyRole,
        getCurrentUser,
        isAuthenticated: isAuthenticated()
    };
};

// Hook para verificar roles específicos
export const useRequireAuth = (requiredRoles?: string[]) => {
    const auth = useAuth();
    
    const canAccess = useCallback(() => {
        if (!auth.isAuthenticated) return false;
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return auth.hasAnyRole(requiredRoles);
    }, [auth.isAuthenticated, auth.hasAnyRole, requiredRoles]);

    return {
        ...auth,
        canAccess: canAccess()
    };
};