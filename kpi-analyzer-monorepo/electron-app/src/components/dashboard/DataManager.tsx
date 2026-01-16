import React, { useState } from 'react';
import { DropZone } from '../DropZone';
import { Database, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface DataManagerProps {
    hasData: boolean;
    lastImportDate?: Date; // Pourrait être enrichi plus tard avec l'API
}

export const DataManager: React.FC<DataManagerProps> = ({ hasData }) => {
    const [isExpanded, setIsExpanded] = useState(!hasData);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            {/* Header / Barre Compacte */}
            <div
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 bg-white"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${hasData ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <Database size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Source de Données</h3>
                        <p className="text-sm text-gray-500">
                            {hasData
                                ? "Données chargées et prêtes à l'analyse"
                                : "Aucune donnée disponible"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasData && !isExpanded && (
                        <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <FileText size={12} />
                            Fichier(s) importé(s)
                        </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Zone Déroulante (DropZone) */}
            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-[500px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="p-6 bg-gray-50/50">
                    <DropZone />
                </div>
            </div>
        </div>
    );
};
