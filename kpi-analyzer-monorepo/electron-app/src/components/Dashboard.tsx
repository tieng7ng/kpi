import React, { useEffect, useState } from 'react';
import { LayoutDashboard, PlusCircle, Database } from 'lucide-react';
import { DashboardGrid } from './dashboard/DashboardGrid';
import { ChartCard } from './dashboard/ChartCard';
import { ChartConfigModal } from './dashboard/ChartConfigModal';
import { ChartDetailModal } from './dashboard/ChartDetailModal';
import { DataPage } from './DataPage';
import type { ChartConfig } from '../types/dashboard';

const API_URL = 'http://localhost:8000/api';

// Config par défaut si localStorage est vide
const DEFAULT_CHARTS: ChartConfig[] = [
    { id: '1', title: 'Revenus Par Région', type: 'area', indicator: 'revenue', categories: ['Nord', 'Sud', 'Est', 'Ouest'], period: '30d', color: '#2563eb' }
];

export const Dashboard: React.FC = () => {
    // État de Navigation
    const [currentView, setCurrentView] = useState<'dashboard' | 'data'>('dashboard');

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
                // Si c'est une vieille config avec 'kpis' mais sans 'indicator'
                if (!c.indicator && c.kpis && c.kpis.length > 0) {
                    return {
                        ...c,
                        indicator: c.kpis[0], // On prend le premier
                        categories: ['Global'], // Défaut
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/kpi/summary`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setRawData(data);

                // Indicators = Noms de KPI uniques
                const indicators = Array.from(new Set(data.map((d: any) => d.kpi_name))).filter(Boolean) as string[];
                setAvailableIndicators(indicators);

                // Categories = Valeurs de la colonne 'category' (Nord, Sud...)
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
        // Validation simple
        if (!config.indicator) {
            alert("Veuillez sélectionner un indicateur");
            return;
        }

        if (charts.find(c => c.id === config.id)) {
            // Modification
            setCharts(charts.map(c => c.id === config.id ? config : c));
        } else {
            // Création
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

    const openNewChartModal = () => {
        setEditingChart(null);
        setIsModalOpen(true);
    };

    // Helper Filtrage Données pour un Chart
    const getChartData = (config: ChartConfig) => {
        if (!rawData.length) return [];

        // 1. Filtrer par Indicateur (ex: 'revenue')
        let filtered = rawData.filter(d => d.kpi_name === config.indicator);

        // 2. Filtrer par Catégories (ex: Seulement 'Nord' et 'Sud')
        // Si aucune catégorie n'est sélectionnée ou 'Global', on prend tout ou 'Global'
        if (config.categories && config.categories.length > 0) {
            filtered = filtered.filter(d => config.categories.includes(d.category));
        }

        // 3. Filtrage par Date
        const now = new Date();
        let minDate: Date | null = null;
        let maxDate: Date | null = null;

        if (config.period === 'custom' && config.startDate) {
            minDate = new Date(config.startDate);
            if (config.endDate) {
                maxDate = new Date(config.endDate);
                maxDate.setHours(23, 59, 59, 999);
            }
        } else if (config.period !== 'custom') {
            minDate = new Date();
            if (config.period === 'year') {
                minDate = new Date(now.getFullYear(), 0, 1);
            } else {
                const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
                const days = daysMap[config.period] || 30;
                minDate.setDate(now.getDate() - days);
            }
            minDate.setHours(0, 0, 0, 0);
        }

        if (minDate) {
            filtered = filtered.filter(d => new Date(d.date) >= minDate!);
        }
        if (maxDate) {
            filtered = filtered.filter(d => new Date(d.date) <= maxDate!);
        }

        // 4. Aggrégation / Pivot selon le Type de Chart

        // CAS 1: PIE (Camembert) -> On veut la somme par catégorie sur toute la période
        if (config.type === 'pie') {
            const aggregation: Record<string, number> = {};
            filtered.forEach(d => {
                const key = d.category || 'Global';
                aggregation[key] = (aggregation[key] || 0) + d.value;
            });
            return Object.entries(aggregation).map(([name, value]) => ({
                date: name, // Hack Recharts: nameKey='date'
                value: value
            }));
        }

        // CAS 2: BAR / LINE / AREA -> Séries Temporelles avec catégories
        // On pivote : une ligne par Date, avec des colonnes pour chaque Catégorie
        // Ex: { date: '2024-01-01', Nord: 100, Sud: 200 }
        const pivoted: Record<string, any> = {};

        filtered.forEach(d => {
            const dateKey = d.date; // String YYYY-MM-DD
            if (!pivoted[dateKey]) {
                pivoted[dateKey] = { date: dateKey };
            }
            const catKey = d.category || 'Global';
            pivoted[dateKey][catKey] = (pivoted[dateKey][catKey] || 0) + d.value;
        });

        return Object.values(pivoted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const handleMaximize = (config: ChartConfig) => {
        setMaximizedChart(config);
    };

    // ROUTING SIMPLE
    if (currentView === 'data') {
        return <DataPage onBack={() => setCurrentView('dashboard')} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">KPI Analyzer</h1>
                        <p className="text-xs text-gray-500 mt-1">Interactif V2.0</p>
                    </div>
                </div>

                {/* Navigation Header */}
                <button
                    onClick={() => setCurrentView('data')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Database size={18} />
                    <span>Mes Données</span>
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
                {/* 1. Tableau de Bord Dynamique */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Mon Tableau de Bord</h2>
                        <button
                            onClick={openNewChartModal}
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
                                        onEdit={handleEditChart}
                                        onDelete={handleDeleteChart}
                                        onMaximize={handleMaximize}
                                    />
                                ))
                            )}
                        </DashboardGrid>
                    )}
                </section>
            </main>

            {/* Modal de Configuration */}
            <ChartConfigModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveChart}
                availableIndicators={availableIndicators}
                availableCategories={availableCategories}
                initialConfig={editingChart}
            />

            {/* Modal Agrandissement (Détail) */}
            <ChartDetailModal
                isOpen={!!maximizedChart}
                onClose={() => setMaximizedChart(null)}
                config={maximizedChart}
                data={maximizedChart ? getChartData(maximizedChart) : []}
            />
        </div>
    );
};
