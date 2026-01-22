import { useState, useCallback } from 'react';

export interface TransportFilters {
    startDate: string | null; // YYYY-MM-DD
    endDate: string | null;   // YYYY-MM-DD
    clients: string[];        // Liste des noms de clients
}

export interface UseTransportFiltersReturn {
    filters: TransportFilters;
    setFilters: (filters: TransportFilters) => void;
    updateStartDate: (date: string | null) => void;
    updateEndDate: (date: string | null) => void;
    toggleClient: (client: string) => void;
    setClients: (clients: string[]) => void;
    resetFilters: () => void;
    buildQueryString: () => string;
    activeFilterCount: number;
}

const INITIAL_FILTERS: TransportFilters = {
    startDate: null,
    endDate: null,
    clients: []
};

export function useTransportFilters(initialFilters?: Partial<TransportFilters>): UseTransportFiltersReturn {
    const [filters, setFiltersState] = useState<TransportFilters>({
        ...INITIAL_FILTERS,
        ...initialFilters
    });

    const setFilters = useCallback((newFilters: TransportFilters) => {
        setFiltersState(newFilters);
    }, []);

    const updateStartDate = useCallback((date: string | null) => {
        setFiltersState(prev => ({ ...prev, startDate: date }));
    }, []);

    const updateEndDate = useCallback((date: string | null) => {
        setFiltersState(prev => ({ ...prev, endDate: date }));
    }, []);

    const toggleClient = useCallback((client: string) => {
        setFiltersState(prev => {
            const exists = prev.clients.includes(client);
            if (exists) {
                return { ...prev, clients: prev.clients.filter(c => c !== client) };
            } else {
                return { ...prev, clients: [...prev.clients, client] };
            }
        });
    }, []);

    const setClients = useCallback((clients: string[]) => {
        setFiltersState(prev => ({ ...prev, clients }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(INITIAL_FILTERS);
    }, []);

    const buildQueryString = useCallback(() => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);
        if (filters.clients.length > 0) params.append('clients', filters.clients.join(','));
        return params.toString();
    }, [filters]);

    const activeFilterCount = (filters.startDate ? 1 : 0) +
        (filters.endDate ? 1 : 0) +
        (filters.clients.length > 0 ? 1 : 0);

    return {
        filters,
        setFilters,
        updateStartDate,
        updateEndDate,
        toggleClient,
        setClients,
        resetFilters,
        buildQueryString,
        activeFilterCount
    };
}
