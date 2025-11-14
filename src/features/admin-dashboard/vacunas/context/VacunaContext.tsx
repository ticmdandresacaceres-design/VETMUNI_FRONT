import { createContext, useContext } from "react";
import useVacunas from "../hooks/useVacunas";

const VacunaContext = createContext<ReturnType<typeof useVacunas> | undefined>(undefined);

export const VacunaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const vacuna = useVacunas();
    return <VacunaContext.Provider value={vacuna}>{children}</VacunaContext.Provider>;
};

export const useVacunaContext = () => {
    const context = useContext(VacunaContext);
    if (!context) {
        throw new Error("useVacunaContext must be used within a VacunaProvider");
    }
    return context;
};
