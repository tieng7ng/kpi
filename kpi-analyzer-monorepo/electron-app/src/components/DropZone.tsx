import React, { useCallback, useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { authService } from '../services/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const DropZone: React.FC = () => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState('');

    const onDragTheta = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onDragEnter = useCallback((e: React.DragEvent) => {
        onDragTheta(e);
        setIsDragActive(true);
    }, [onDragTheta]);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        onDragTheta(e);
        setIsDragActive(false);
    }, [onDragTheta]);

    const handleUpload = async (file: File) => {
        setUploadStatus('uploading');
        setFileName(file.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: authService.getAuthHeaders(),
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            console.log('Upload success:', data);
            setUploadStatus('success');

            // Notify parent or trigger refresh (simplified for MVP)
            window.dispatchEvent(new Event('kpi-data-updated'));

        } catch (error) {
            console.error('Upload Error:', error);
            setUploadStatus('error');
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        onDragTheta(e);
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0]);
        }
    }, [onDragTheta]);

    return (
        <div
            className={clsx(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50",
                uploadStatus === 'uploading' && "opacity-50 pointer-events-none"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragTheta}
            onDrop={onDrop}
        >
            <div className="flex flex-col items-center justify-center gap-2">
                {uploadStatus === 'idle' && (
                    <>
                        <UploadCloud className="w-12 h-12 text-gray-400" />
                        <p className="text-sm text-gray-600 font-medium">
                            Glissez-déposez vos fichiers KPI ici
                        </p>
                        <p className="text-xs text-gray-400">CSV, Excel supportés</p>
                    </>
                )}

                {uploadStatus === 'uploading' && (
                    <>
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-sm text-blue-600">Analayse de {fileName}...</p>
                    </>
                )}

                {uploadStatus === 'success' && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500" />
                        <p className="text-sm text-green-600">Import réussi !</p>
                        <button
                            onClick={() => setUploadStatus('idle')}
                            className="mt-2 text-xs text-blue-500 underline"
                        >
                            Importer un autre fichier
                        </button>
                    </>
                )}

                {uploadStatus === 'error' && (
                    <>
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-sm text-red-600">Erreur lors de l'import</p>
                        <button
                            onClick={() => setUploadStatus('idle')}
                            className="mt-2 text-xs text-red-500 underline"
                        >
                            Réessayer
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
