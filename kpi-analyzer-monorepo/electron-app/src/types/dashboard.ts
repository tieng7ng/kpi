export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface ChartConfig {
    id: string;
    title: string;
    type: ChartType;
    indicator: string; // Ex: 'revenue'
    categories: string[]; // Ex: ['Nord', 'Sud'] (Remplacera 'kpis')
    period: '7d' | '30d' | '90d' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
    color?: string;
}

export interface DashboardLayout {
    charts: ChartConfig[];
}
