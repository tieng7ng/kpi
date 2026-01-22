import { useEffect, useState } from 'react';
import { Activity, Box, TrendingUp, DollarSign, Settings } from "lucide-react";
import { KPIChart } from "../KPIChart";
import { useTransportFilters } from '../../hooks/useTransportFilters';
import { TransportFilterModal } from './filters/TransportFilterModal';

interface TransportStats {
    count: number;
    revenue: number;
    margin: number;
    tonnage: number;
    shipments: number;
    margin_rate: number;
}

const API_URL = "http://localhost:8000/api";

export function TransportDashboard() {
    const [stats, setStats] = useState<TransportStats | null>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [clientData, setClientData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Filter Hook
    const filterManager = useTransportFilters();
    const { filters, setFilters, buildQueryString, activeFilterCount } = filterManager;

    const fetchData = async () => {
        setLoading(true);
        try {
            const queryString = buildQueryString();
            const queryURL = queryString ? `?${queryString}` : '';

            const [statsRes, revRes, clientRes] = await Promise.all([
                fetch(`${API_URL}/transport/stats${queryURL}`),
                fetch(`${API_URL}/transport/graph/revenue${queryURL}`),
                fetch(`${API_URL}/transport/graph/distribution?type=client&${queryString}`)
            ]);

            const statsData = await statsRes.json();
            const revData = await revRes.json();
            const clientData = await clientRes.json();

            setStats(statsData);
            setRevenueData(revData);
            setClientData(clientData);
        } catch (error) {
            console.error("Failed to fetch transport data", error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when filters change (debouncing could be added here if needed, but manual Apply is safer)
    // Actually, in the Modal logic, we only apply when user clicks "Apply", so we can listen to filters change?
    // But filters state changes only on Apply in the modal? 
    // Wait, the hook manages active state. The modal manages local state and calls setFilters on apply.
    // So yes, we should listen to filters here.
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    if (!stats && loading) return <div className="p-8 text-center text-gray-400">Chargement du Dashboard Transport...</div>;
    // We allow rendering even if loading updates to show previous data or loading overaly

    return (
        <div className="space-y-6 relative">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Chiffre d'Affaires"
                    value={stats ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.revenue) : '-'}
                    icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                    subtext={stats ? "Total importé" : ""}
                    onAction={() => setIsFilterModalOpen(true)}
                    actionIcon={<Settings size={14} />}
                    isActionActive={activeFilterCount > 0}
                />
                <StatsCard
                    title="Marge Brute"
                    value={stats ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.margin) : '-'}
                    icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                    subtext={stats ? `${stats.margin_rate.toFixed(1)}% du CA` : ""}
                />
                <StatsCard
                    title="Volume / Tonnage"
                    value={stats ? `${stats.tonnage.toFixed(0)} T` : '-'}
                    icon={<Box className="w-4 h-4 text-blue-500" />}
                    subtext={stats ? `${stats.shipments} expéditions` : ""}
                />
                <StatsCard
                    title="Performance"
                    value={stats ? `${(stats.revenue / (stats.shipments || 1)).toFixed(0)} €` : '-'}
                    icon={<Activity className="w-4 h-4 text-purple-500" />}
                    subtext="Panier moyen par envoi"
                />
            </div>

            {/* Main Charts */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Revenue Evolution (Large) */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
                        <div className="p-6 pb-2">
                            <h3 className="text-lg font-semibold text-gray-100">Évolution Activité (CA vs Marge)</h3>
                        </div>
                        <div className="p-6 pt-0">
                            {(() => {
                                // Determine optimal unit based on max value
                                const maxVal = Math.max(...revenueData.map(d => Math.max(d.revenue || 0, d.margin || 0)), 0);
                                const isSmallScale = maxVal < 2000;

                                return (
                                    <KPIChart
                                        type="composed"
                                        data={revenueData}
                                        title=""
                                        kpiKeys={['revenue', 'margin']}
                                        height={350}
                                        formatter={(val: number) =>
                                            isSmallScale
                                                ? `${new Intl.NumberFormat('fr-FR').format(val)} €`
                                                : `${(Number(val) / 1000).toFixed(0)} k€`
                                        }
                                        colors={['#3b82f6', '#10b981']} // Blue for Rev, Green for Margin
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Top Clients Distribution */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm h-full">
                        <div className="p-6 pb-2">
                            <h3 className="text-lg font-semibold text-gray-100">Top 10 Clients (CA)</h3>
                        </div>
                        <div className="p-6 pt-0">
                            <KPIChart
                                type="bar"
                                data={clientData}
                                title=""
                                kpiKeys={['value']}
                                height={350}
                                formatter={(val: any) => `${(Number(val) / 1000).toFixed(0)}k€`}
                                colors={['#8b5cf6']}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <TransportFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={filters}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                    // Fetch will happen via useEffect
                }}
            />
        </div>
    );
}


function StatsCard({
    title,
    value,
    icon,
    subtext,
    onAction,
    actionIcon,
    isActionActive = false
}: {
    title: string,
    value: string,
    icon: any,
    subtext: string,
    onAction?: () => void,
    actionIcon?: any,
    isActionActive?: boolean
}) {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-6 relative group">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                <div className="flex items-center gap-2">
                    {/* Action Button (Visible on hover or if active) */}
                    {onAction && (
                        <button
                            onClick={onAction}
                            className={`p-1 rounded transition-all ${isActionActive
                                ? 'text-blue-400 bg-blue-400/10 opacity-100'
                                : 'text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100'
                                }`}
                            title="Filtrer"
                        >
                            {actionIcon}
                            {isActionActive && <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>}
                        </button>
                    )}
                    {icon}
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-100">{value}</div>
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
        </div>
    );
}
