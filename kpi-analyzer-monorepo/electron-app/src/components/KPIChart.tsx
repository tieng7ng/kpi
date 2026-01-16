import React from 'react';
import {
    AreaChart, Area,
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { ChartType } from '../types/dashboard';

interface KPIChartProps {
    data: any[];
    title?: string; // Optionnel car géré par ChartCard
    color?: string;
    type?: ChartType;
    kpiKeys?: string[];
}

export const KPIChart: React.FC<KPIChartProps> = ({ data, title, color = "#8884d8", type = 'area', kpiKeys = [] }) => {

    // Palette de couleurs pour les graphes empilés
    const COLORS = ['#2563eb', '#16a34a', '#db2777', '#ca8a04', '#9333ea', '#0891b2', '#ea580c'];

    const renderChart = () => {
        switch (type) {
            case 'bar':
                // Si pas de clés spécifiées, on devine depuis les données (sauf date)
                const keys = kpiKeys.length > 0
                    ? kpiKeys
                    : (data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'date') : ['value']);

                return (
                    <BarChart
                        data={data}
                        // layout="horizontal" (défaut: barres verticales)
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {keys.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a" // Empilement
                                fill={COLORS[index % COLORS.length]}
                                radius={index === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                name={key}
                            />
                        ))}
                    </BarChart>
                );
            case 'line':
                // Si pas de clés spécifiées, on devine depuis les données
                const lineKeys = kpiKeys.length > 0
                    ? kpiKeys
                    : (data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'date') : ['value']);

                return (
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {lineKeys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }} // Points visibles pour montrer les données isolées
                                name={key}
                            />
                        ))}
                    </LineChart>
                );
            case 'pie':
                // Pour le Pie chart, on agrège souvent les données ou on montre la répartition
                // Simplification MVP : On affiche les valeurs telles quelles
                // const COLORS = ['#2563eb', '#16a34a', '#db2777', '#ca8a04', '#9333ea', '#0891b2', '#ea580c'];

                return (
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="date" // Correspond à notre agrégation (label)
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            fill={color}
                            label={({ name, percent }: { name?: string, percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                );
            case 'area':
            default:
                return (
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
                    </AreaChart>
                );
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {title && <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>}
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};
