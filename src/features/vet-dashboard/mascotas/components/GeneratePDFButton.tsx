"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";
import { useState } from "react";
import { MascotaPageDetails } from "../types";
import { generateMascotaPDF } from "@/src/lib/utils/dim-generador";
import { toast } from "sonner";

interface GeneratePDFButtonProps {
    mascotaData: MascotaPageDetails;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
}

const GeneratePDFButton: React.FC<GeneratePDFButtonProps> = ({
    mascotaData,
    variant = "outline",
    size = "sm"
}) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        try {
            await generateMascotaPDF(mascotaData);
            toast.success("Credencial generada exitosamente");
        } catch (error) {
            console.error("Error al generar credencial:", error);
            toast.error("Error al generar la credencial");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex items-center gap-2"
        >
            {isGenerating ? (
                <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generando...
                </>
            ) : (
                <>
                    <CreditCard className="w-4 h-4" />
                    Generar DNI
                </>
            )}
        </Button>
    );
};

export default GeneratePDFButton;