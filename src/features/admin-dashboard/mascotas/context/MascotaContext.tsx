"use client";

import { createContext, useContext } from "react";
import useMascotas from "../hooks/useMascotas";

const MascotaContext = createContext<ReturnType<typeof useMascotas> | undefined>(undefined);

export const MascotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mascota = useMascotas ();
    return <MascotaContext.Provider value={mascota}>{children}</MascotaContext.Provider>;
};

export const useMascotaContext = () => {
    const context = useContext(MascotaContext);
    if (!context) {
        throw new Error("useMascotaContext must be used within a MascotaProvider");
    }
    return context;
};
