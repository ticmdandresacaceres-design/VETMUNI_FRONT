"use client";

import { createContext, useContext } from "react";
import { useVeterinarios } from "../hooks/useVet";

const VetContext = createContext<ReturnType<typeof useVeterinarios> | undefined>(undefined);

export const VetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const vet = useVeterinarios();
    return <VetContext.Provider value={vet}>{children}</VetContext.Provider>;
};

export const useVetContext = () => {
    const context = useContext(VetContext);
    if (!context) {
        throw new Error("useVetContext must be used within a VetProvider");
    }
    return context;
};
