import React, { useEffect, useState } from 'react';
import { X, Filter } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { ClientSelector } from './ClientSelector';
import type { TransportFilters } from '../../../hooks/useTransportFilters';

interface TransportFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: TransportFilters;
    onApply: (filters: TransportFilters) => void;
}

const API_URL = 'http://localhost:8000/api';

export const TransportFilterModal: React.FC<TransportFilterModalProps> = ({
    isOpen,
    onClose,
    currentFilters,
    onApply
}) => {
    // Local state for editing filters before applying
    const [filters, setFilters] = useState<TransportFilters>(currentFilters);
    const [clientsList, setClientsList] = useState<any[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setFilters(currentFilters);
            // Fetch clients if needed (could be optimized to fetch once)
            fetchClients();
        }
    }, [isOpen, currentFilters]);

    const fetchClients = async () => {
        if (clientsList.length > 0) return; // Cache simple
        setLoadingClients(true);
        try {
            const res = await fetch(`${API_URL}/transport/clients`);
            const data = await res.json();
            if (data.clients) {
                setClientsList(data.clients);
            }
        } catch (e) {
            console.error("Error fetching clients", e);
        } finally {
            setLoadingClients(false);
        }
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        // Reset local state to empty
        setFilters({ startDate: null, endDate: null, clients: [] });
    };

    const toggleClient = (clientName: string) => {
        setFilters(prev => {
            const exists = prev.clients.includes(clientName);
            if (exists) {
                return { ...prev, clients: prev.clients.filter(c => c !== clientName) };
            } else {
                return { ...prev, clients: [...prev.clients, clientName] };
            }
        });
    };

    const selectAllClients = () => {
        // Only select currently visible clients if search implemented, but here we select all loaded
        const allNames = clientsList.map(c => c.name);
        setFilters(prev => ({ ...prev, clients: allNames }));
    };

    const deselectAllClients = () => {
        setFilters(prev => ({ ...prev, clients: [] }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Filter size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Filtrer les données</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Col: Period */}
                    <div className="space-y-6">
                        <DateRangePicker
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            onChange={(start, end) => setFilters(prev => ({ ...prev, startDate: start, endDate: end }))}
                        />

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                            <p>Les filtres s'appliquent à tous les graphiques et statistiques du dashboard Transport.</p>
                        </div>
                    </div>

                    {/* Right Col: Clients */}
                    <div className="min-h-[300px] flex flex-col">
                        {loadingClients ? (
                            <div className="flex items-center justify-center h-full text-gray-400">Chargement des clients...</div>
                        ) : (
                            <ClientSelector
                                clients={clientsList}
                                selectedClients={filters.clients}
                                onToggleClient={toggleClient}
                                onSelectAll={selectAllClients}
                                onDeselectAll={deselectAllClients}
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between rounded-b-xl">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Réinitialiser
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors font-semibold"
                        >
                            Appliquer les filtres
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
