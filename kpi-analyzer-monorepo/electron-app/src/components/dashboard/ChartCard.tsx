import React from 'react';
import type { ChartConfig } from '../../types/dashboard';
import { KPIChart } from '../KPIChart';
import { Settings, Trash2, Maximize2 } from 'lucide-react';

interface ChartCardProps {
    config: ChartConfig;
    data: any[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onMaximize: (config: ChartConfig) => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({ config, data, onEdit, onDelete, onMaximize }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[350px] transition-all hover:shadow-md group">
            {/* Header de la Carte */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700 truncate" title={config.title}>
                    {config.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onMaximize(config)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        title="Agrandir"
                    >
                        <Maximize2 size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(config.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        title="Configurer"
                    >
                        <Settings size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(config.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded"
                        title="Supprimer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Contenu Graphique */}
            <div className="flex-1 min-h-0">
                <KPIChart
                    data={data}
                    title="" // Titre déjà géré par la Card
                    color={config.color}
                    type={config.type}
                    kpiKeys={config.categories}
                />
            </div>
        </div>
    );
};
