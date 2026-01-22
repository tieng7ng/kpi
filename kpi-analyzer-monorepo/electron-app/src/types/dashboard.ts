export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'composed';

export interface ChartConfig {
    id: string;
    type: ChartType;
    title: string;
    indicator: string; // e.g. 'montant_net_ht'
    categories: string[]; // e.g. ['FR', 'DE'] for grouping, or just ['Global']
    color?: string; // Legacy single color
    formatter?: 'currency' | 'number' | 'percent';
    period?: string;
    startDate?: string;
    endDate?: string;
    kpis?: string[]; // Legacy support
}

export interface DashboardLayout {
    charts: ChartConfig[];
}
