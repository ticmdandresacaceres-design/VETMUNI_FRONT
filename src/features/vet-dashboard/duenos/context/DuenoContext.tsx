"use client";

import { createContext, useContext } from "react";
import { useDuenos } from "../hooks/useDuenos";

const DuenoContext = createContext<ReturnType<typeof useDuenos> | undefined>(undefined);

export const DuenoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dueno = useDuenos();
    return <DuenoContext.Provider value={dueno}>{children}</DuenoContext.Provider>;
};

export const useDuenoContext = () => {
    const context = useContext(DuenoContext);
    if (!context) {
        throw new Error("useDuenoContext must be used within a DuenoProvider");
    }
    return context;
};
