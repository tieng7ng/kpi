import React, { useEffect, useState } from 'react';
import { DropZone } from './DropZone';
import { ArrowLeft, FileSpreadsheet, HardDrive, Calendar, FileText, Trash2, Download } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

interface ImportedFile {
    id: number;
    filename: string;
    import_date: string;
    status: string;
    checksum: string;
}

interface DataPageProps {
    onBack: () => void;
}

export const DataPage: React.FC<DataPageProps> = ({ onBack }) => {
    const [files, setFiles] = useState<ImportedFile[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/upload/files`);
            if (res.ok) {
                const data = await res.json();
                setFiles(data);
            }
        } catch (e) {
            console.error("Erreur chargement fichiers", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
        // Écouter les événements d'upload pour rafraîchir la liste
        window.addEventListener('kpi-data-updated', fetchFiles);
        return () => window.removeEventListener('kpi-data-updated', fetchFiles);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Retour Dashboard
                </button>
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="p-1 bg-gray-100 rounded"><HardDrive size={16} /></span>
                    <span className="text-sm font-medium">Gestion des Données</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-8 space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes Sources de Données</h2>
                    <p className="text-gray-500 mb-6">Gérez vos fichiers importés et ajoutez de nouvelles sources.</p>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileSpreadsheet className="text-green-600" size={20} />
                            Nouvel Import
                        </h3>
                        <DropZone />
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        Fichiers Importés
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{files.length}</span>
                    </h3>

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Chargement...</div>
                    ) : files.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 italic">
                            Aucun fichier importé pour le moment.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {files.map(file => (
                                <div key={file.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg h-fit">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg">{file.filename}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(file.import_date).toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`w-2 h-2 rounded-full ${file.status === 'PROCESSED' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                    {file.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Télécharger">
                                            <Download size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
