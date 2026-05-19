"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUploadPetImage } from "../hooks/useMascotas";

interface AddImagenModalProps {
    isOpen: boolean;
    onClose: () => void;
    mascotaId: string;
    mascotaNombre?: string;
}

const AddImagenModal: React.FC<AddImagenModalProps> = ({
    isOpen,
    onClose,
    mascotaId,
    mascotaNombre = "esta mascota"
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const uploadImageMutation = useUploadPetImage();

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo debe ser menor a 5MB');
            return;
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Por favor selecciona una imagen');
            return;
        }

        try {
            await uploadImageMutation.mutateAsync({ petId: mascotaId, image: selectedFile });
            handleClose();
        } catch (error) {
            console.error('Error al subir imagen:', error);
        }
    };

    const handleClose = () => {
        clearSelectedFile();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar Imagen</DialogTitle>
                    <DialogDescription>
                        Sube una nueva imagen para {mascotaNombre}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Imagen</Label>
                        <div
                            className={`
                                border-2 border-dashed rounded-lg p-6 text-center transition-colors
                                ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                                ${selectedFile ? 'border-green-500 bg-green-50' : ''}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {selectedFile ? (
                                <div className="space-y-2">
                                    {previewUrl && (
                                        <div className="relative mx-auto w-32 h-32">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearSelectedFile}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-sm text-green-600 font-medium">
                                        {selectedFile.name}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Arrastra una imagen aquí o haz clic para seleccionar
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, JPEG hasta 5MB
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                            id="file-input"
                        />
                        {!selectedFile && (
                            <Label htmlFor="file-input" className="block">
                                <Button type="button" variant="outline" className="w-full" asChild>
                                    <span>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Seleccionar imagen
                                    </span>
                                </Button>
                            </Label>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={uploadImageMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!selectedFile || uploadImageMutation.isPending}
                        >
                            {uploadImageMutation.isPending ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Subir Imagen
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddImagenModal;
