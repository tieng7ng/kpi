import React, { useMemo } from 'react';
import { X, Maximize2, Minimize2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { KPIChart } from '../KPIChart';
import type { ChartConfig } from '../../types/dashboard';

interface ChartDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: ChartConfig | null;
    data: any[];
}

export const ChartDetailModal: React.FC<ChartDetailModalProps> = ({ isOpen, onClose, config, data }) => {
    if (!isOpen || !config) return null;

    // Calcul des statistiques
    const stats = useMemo(() => {
        if (!data || data.length === 0) return null;

        // Aplatir les valeurs si pivoté (ex: plusieurs catégories)
        // Ou prendre 'value' si simple
        let allValues: number[] = [];

        data.forEach(d => {
            if (d.value !== undefined) {
                allValues.push(d.value);
            } else {
                // Si objet pivoté (date, Nord, Sud...), on prend toutes les clés sauf 'date'
                Object.keys(d).forEach(key => {
                    if (key !== 'date' && typeof d[key] === 'number') {
                        allValues.push(d[key]);
                    }
                });
            }
        });

        if (allValues.length === 0) return null;

        const sum = allValues.reduce((a, b) => a + b, 0);
        const avg = sum / allValues.length;
        const min = Math.min(...allValues);
        const max = Math.max(...allValues);

        return { sum, avg, min, max };
    }, [data]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full h-full flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-8 py-6 border-b flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
                        <p className="text-gray-500 mt-1">
                            {config.indicator} • {config.period} • {config.categories?.join(', ') || 'Global'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={32} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                    {/* Chart Area (Big) */}
                    <div className="flex-1 p-8 min-h-[50vh] bg-gray-50">
                        <KPIChart
                            data={data}
                            type={config.type}
                            color={config.color}
                            kpiKeys={config.categories}
                        />
                    </div>

                    {/* Sidebar Stats */}
                    {stats && (
                        <div className="w-full lg:w-80 border-l bg-white p-6 space-y-6 overflow-y-auto">
                            <h3 className="font-semibold text-gray-700 uppercase tracking-wider text-sm">Statistiques</h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <Activity size={20} />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">Moyenne</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{stats.avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                                </div>

                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                            <TrendingUp size={20} />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">Maximum</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">{stats.max.toLocaleString()}</p>
                                </div>

                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                            <TrendingDown size={20} />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">Minimum</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-900">{stats.min.toLocaleString()}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm text-gray-600 font-medium">Total (Somme)</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.sum.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
