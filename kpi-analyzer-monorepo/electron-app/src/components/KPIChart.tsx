import {
    AreaChart, Area,
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    ComposedChart, Legend,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { ChartType } from '../types/dashboard';

interface KPIChartProps {
    data: any[];
    title: string;
    type: ChartType;
    kpiKeys?: string[]; // Pour Line/Bar/Area/Composed
    colors?: string[];
    color?: string; // Legacy/Single color support
    formatter?: any;
    height?: number;
    indicators?: string[]; // Legacy
}

export function KPIChart({ type = 'area', data, title, kpiKeys = [], colors, formatter, color = "#8884d8", height = 300 }: KPIChartProps) {

    // Color palette
    const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"];
    const chartColors = colors || defaultColors;

    const renderChart = () => {
        switch (type) {
            case 'composed':
                // Ensure data exists
                if (!data || data.length === 0) return <div>No Data</div>;
                return (
                    <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        {/* Left Axis for Revenue (Bar), Right for Margin (Line) */}
                        <YAxis stroke="#9ca3af" tickFormatter={formatter} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                            itemStyle={{ color: '#f3f4f6' }}
                            formatter={formatter}
                        />
                        <Legend />
                        {kpiKeys.map((key, index) => {
                            if (index === 0) {
                                return <Bar key={key} dataKey={key} fill={chartColors[0]} radius={[4, 4, 0, 0]} name={key} />;
                            } else {
                                return <Line key={key} type="monotone" dataKey={key} stroke={chartColors[1]} strokeWidth={2} dot={{ r: 4 }} name={key} />;
                            }
                        })}
                    </ComposedChart>
                );
            case 'bar':
                // Si pas de clés spécifiées, on devine depuis les données (sauf date)
                const barKeys = kpiKeys.length > 0
                    ? kpiKeys
                    : (data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'date' && k !== 'name') : ['value']);

                return (
                    <BarChart
                        data={data}
                        // layout="horizontal" (défaut: barres verticales)
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={data[0]?.name ? "name" : "date"} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatter} />
                        <Tooltip formatter={formatter} />
                        {barKeys.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a" // Empilement
                                fill={chartColors[index % chartColors.length]}
                                radius={index === barKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                name={key}
                            />
                        ))}
                    </BarChart>
                );
            case 'line':
                // Si pas de clés spécifiées, on devine depuis les données
                const lineKeys = kpiKeys && kpiKeys.length > 0
                    ? kpiKeys
                    : (data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'date' && k !== 'name') : ['value']);

                return (
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={data[0]?.name ? "name" : "date"} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatter} />
                        <Tooltip formatter={formatter} />
                        {lineKeys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={chartColors[index % chartColors.length]}
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
                            nameKey="name" // Correspond à notre agrégation (label)
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            fill={color}
                            label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
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
                        <XAxis dataKey={data[0]?.name ? "name" : "date"} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatter} />
                        <Tooltip formatter={formatter} />
                        <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
                    </AreaChart>
                );
        }
    };

    return (
        <div className="w-full flex flex-col">
            {title && <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>}
            <div className="w-full" style={{ height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
