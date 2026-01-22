import { useEffect, useState } from 'react';
import { LayoutDashboard, PlusCircle, Database, TrendingUp, Settings, Plus } from 'lucide-react';
import { DashboardGrid } from './dashboard/DashboardGrid';
import { ChartCard } from './dashboard/ChartCard';
import { ChartConfigModal } from './dashboard/ChartConfigModal';
import { ChartDetailModal } from './dashboard/ChartDetailModal';
import { DataPage } from './DataPage';
import { TransportDashboard } from './dashboard/TransportDashboard';
// import { Card } from "@/components/ui/card"; // Removing potential missing import
import type { ChartConfig } from '../types/dashboard';

const API_URL = 'http://localhost:8000/api';

// Config par défaut si localStorage est vide
const DEFAULT_CHARTS: ChartConfig[] = [
    { id: '1', title: 'Revenus Par Région', type: 'area', indicator: 'revenue', categories: ['Nord', 'Sud', 'Est', 'Ouest'], color: '#2563eb' }
];

export function Dashboard() {
    // État de Navigation
    const [currentView, setCurrentView] = useState<'dashboard' | 'data'>('dashboard');
    const [viewMode, setViewMode] = useState<'kpi' | 'transport'>('kpi');
    const [hasTransportData, setHasTransportData] = useState(false);

    // État des données brutes
    const [rawData, setRawData] = useState<any[]>([]);
    const [availableIndicators, setAvailableIndicators] = useState<string[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // État du Dashboard (Graphiques)
    const [charts, setCharts] = useState<ChartConfig[]>(() => {
        const saved = localStorage.getItem('kpi_dashboard_layout');
        let parsed = saved ? JSON.parse(saved) : DEFAULT_CHARTS;

        // MIGRATION V1 -> V2 (KPIs multiples -> Single Indicator)
        if (Array.isArray(parsed)) {
            parsed = parsed.map((c: any) => {
                if (!c.indicator && c.kpis && c.kpis.length > 0) {
                    return {
                        ...c,
                        indicator: c.kpis[0],
                        categories: ['Global'],
                    };
                }
                return c;
            });
        }
        return parsed;
    });

    // État du Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
    const [maximizedChart, setMaximizedChart] = useState<ChartConfig | null>(null);

    // Sauvegarde auto
    useEffect(() => {
        localStorage.setItem('kpi_dashboard_layout', JSON.stringify(charts));
    }, [charts]);

    const checkTransportData = async () => {
        try {
            console.log("Checking transport stats...");
            const res = await fetch(`${API_URL}/transport/stats`);
            const data = await res.json();
            console.log("Transport stats received:", data);
            if (data.count > 0) {
                console.log("Setting hasTransportData = TRUE");
                setHasTransportData(true);
            } else {
                console.log("Count is 0, hasTransportData = FALSE");
            }
        } catch (err) {
            console.error("Error checking transport stats", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Check Transport Data
            await checkTransportData();

            const res = await fetch(`${API_URL}/kpi/summary`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setRawData(data);
                const indicators = Array.from(new Set(data.map((d: any) => d.kpi_name))).filter(Boolean) as string[];
                setAvailableIndicators(indicators);
                const cats = Array.from(new Set(data.map((d: any) => d.category))).filter((c) => c && c !== 'Global') as string[];
                setAvailableCategories(cats.length > 0 ? cats : ['Global']);
            }
        } catch (e) {
            console.error("Erreur fetch:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('kpi-data-updated', fetchData);
        return () => window.removeEventListener('kpi-data-updated', fetchData);
    }, []);

    // Helpers Gestion Graphiques
    const handleSaveChart = (config: ChartConfig) => {
        if (!config.indicator) {
            alert("Veuillez sélectionner un indicateur");
            return;
        }

        if (charts.find(c => c.id === config.id)) {
            setCharts(charts.map(c => c.id === config.id ? config : c));
        } else {
            setCharts([...charts, config]);
        }
        setEditingChart(null);
    };

    const handleDeleteChart = (id: string) => {
        if (confirm('Supprimer ce graphique ?')) {
            setCharts(charts.filter(c => c.id !== id));
        }
    };

    const handleEditChart = (id: string) => {
        const chart = charts.find(c => c.id === id);
        if (chart) {
            setEditingChart(chart);
            setIsModalOpen(true);
        }
    };

    const handleAddChart = () => {
        setEditingChart({
            id: crypto.randomUUID(),
            title: 'Nouveau Graphique',
            type: 'bar',
            indicator: availableIndicators[0] || '',
            categories: [],
            // Default config
            color: '#2563eb'
        });
        setIsModalOpen(true);
    };

    const handleMaximize = (config: ChartConfig) => {
        setMaximizedChart(config);
    };

    // Helper Filtrage Données pour un Chart
    const getChartData = (config: ChartConfig) => {
        if (!rawData.length) return [];
        let filtered = rawData.filter(d => d.kpi_name === config.indicator);

        if (config.categories && config.categories.length > 0) {
            filtered = filtered.filter(d => config.categories.includes(d.category));
        }

        if (config.period && config.period !== 'custom') {
            const now = new Date();
            let startDate = new Date();

            switch (config.period) {
                case '7d': startDate.setDate(now.getDate() - 7); break;
                case '30d': startDate.setDate(now.getDate() - 30); break;
                case '90d': startDate.setDate(now.getDate() - 90); break;
                case 'year': startDate.setFullYear(now.getFullYear() - 1); break; // Or start of year? Let's say last 12 months for now unless "This Year" implies Jan 1. Usually rolling window is easier. "Cette année" usually means Jan 1. Let's do Jan 1 for 'year' logic if it matches user expectation, or rolling year. "Cette année" -> current year.
            }
            // Adjustment for 'year' to mean "Current Year" if preferred, but usually rolling window is better for analysis.
            // Let's stick to rolling window for 7/30/90. For 'year', let's check what the option label says: "Cette année". So it should include data from Jan 1st.
            if (config.period === 'year') {
                startDate = new Date(now.getFullYear(), 0, 1);
            }

            filtered = filtered.filter(d => new Date(d.date) >= startDate);
        } else if (config.period === 'custom' && config.startDate && config.endDate) {
            const start = new Date(config.startDate);
            const end = new Date(config.endDate);
            // End date inclusive adjustment (if needed, usually date strings are midnight)
            // Let's compare as YYYY-MM-DD strings potentially or timestamps
            filtered = filtered.filter(d => {
                const dDate = new Date(d.date);
                return dDate >= start && dDate <= end;
            });
        }

        // 4. Aggrégation / Pivot
        if (config.type === 'pie') {
            const aggregation: Record<string, number> = {};
            filtered.forEach(d => {
                const key = d.category || 'Global';
                aggregation[key] = (aggregation[key] || 0) + d.value;
            });
            return Object.entries(aggregation).map(([name, value]) => ({
                name: name, // name for Pie
                value: value
            }));
        }

        // Pivot Date x Category
        const pivoted: Record<string, any> = {};
        filtered.forEach(d => {
            const dateKey = d.date; // String YYYY-MM-DD
            if (!pivoted[dateKey]) {
                pivoted[dateKey] = { date: dateKey };
            }
            const catKey = d.category || 'Global';
            // Use catKey for Bar/Line data keys
            pivoted[dateKey][catKey] = (pivoted[dateKey][catKey] || 0) + d.value;
        });

        return Object.values(pivoted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const renderContent = () => {
        if (currentView === 'data') {
            return <DataPage onBack={() => setCurrentView('dashboard')} />;
        }

        if (viewMode === 'transport') {
            return <TransportDashboard />;
        }

        return (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Mon Tableau de Bord</h2>
                    <button
                        onClick={handleAddChart}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <PlusCircle size={18} />
                        Nouveau Graphique
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12 text-gray-400">Chargement des données...</div>
                ) : (
                    <DashboardGrid>
                        {charts.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 text-gray-400">
                                Aucun graphique. Cliquez sur "Nouveau Graphique" pour commencer.
                            </div>
                        ) : (
                            charts.map(chart => (
                                <ChartCard
                                    key={chart.id}
                                    config={chart}
                                    data={getChartData(chart)}
                                    onEdit={() => handleEditChart(chart.id)}
                                    onDelete={() => handleDeleteChart(chart.id)}
                                    onMaximize={() => handleMaximize(chart)}
                                />
                            ))
                        )}
                        {/* Custom "Add" Card */}
                        <div
                            className="bg-gray-800 border border-gray-700 border-dashed rounded-lg flex flex-col items-center justify-center h-[300px] cursor-pointer hover:bg-gray-750 transition-colors"
                            onClick={handleAddChart}
                        >
                            <Plus className="w-12 h-12 text-gray-500 mb-4" />
                            <span className="text-gray-400 font-medium">Ajouter un graphique</span>
                        </div>
                    </DashboardGrid>
                )}
            </section>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">
                            {viewMode === 'transport' ? 'Transport & Logistique' : 'KPI Analyzer'}
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            {viewMode === 'transport' ? 'Suivi de la performance import/export' : 'Tableau de bord de performance'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {hasTransportData && (
                        <div className="bg-gray-100 p-1 rounded-lg flex border border-gray-200">
                            <button
                                onClick={() => setViewMode('kpi')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'kpi' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Général
                            </button>
                            <button
                                onClick={() => setViewMode('transport')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'transport' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Transport
                            </button>
                        </div>
                    )}
                    {/* DEBUG ONLY: Remove after fix */}
                    {!hasTransportData && (
                        <div className="text-xs text-red-400 border border-red-200 p-1 rounded">
                            No Transport Data Check.
                        </div>
                    )}

                    <button
                        onClick={() => setCurrentView(currentView === 'dashboard' ? 'data' : 'dashboard')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {currentView === 'dashboard' ? <Database size={18} /> : <TrendingUp size={18} />}
                        <span>{currentView === 'dashboard' ? 'Mes Données' : 'Dashboard'}</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 pb-8">
                {renderContent()}
            </main>

            {/* Modals */}
            <ChartConfigModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingChart(null); }}
                onSave={handleSaveChart}
                availableIndicators={availableIndicators}
                availableCategories={availableCategories}
                initialConfig={editingChart}
            />

            {maximizedChart && (
                <ChartDetailModal
                    isOpen={!!maximizedChart}
                    onClose={() => setMaximizedChart(null)}
                    config={maximizedChart}
                    data={getChartData(maximizedChart)}
                />
            )}
        </div>
    );
}
