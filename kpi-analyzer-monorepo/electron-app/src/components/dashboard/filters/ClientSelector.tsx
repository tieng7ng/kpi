import React, { useState, useMemo } from 'react';
import { Search, CheckSquare, Square, Users } from 'lucide-react';

interface Client {
    name: string;
    ca_total: number;
    nb_envois: number;
}

interface ClientSelectorProps {
    clients: Client[];
    selectedClients: string[];
    onToggleClient: (client: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
    clients,
    selectedClients,
    onToggleClient,
    onSelectAll,
    onDeselectAll
}) => {
    const [search, setSearch] = useState('');

    const filteredClients = useMemo(() => {
        if (!search) return clients;
        const lowerSearch = search.toLowerCase();
        return clients.filter(c => c.name.toLowerCase().includes(lowerSearch));
    }, [clients, search]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-4 flex flex-col h-full">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users size={16} />
                    Clients ({selectedClients.length > 0 ? `${selectedClients.length}/${clients.length}` : 'Tous'})
                </div>
                <div className="flex gap-2 text-xs">
                    <button onClick={onSelectAll} className="text-blue-600 hover:text-blue-800">Tout</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={onDeselectAll} className="text-gray-500 hover:text-gray-700">Aucun</button>
                </div>
            </h3>

            {/* Barre de recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Liste scrollable */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 min-h-[200px] max-h-[300px]">
                {filteredClients.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Aucun client trouvé</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredClients.map(client => {
                            const isSelected = selectedClients.includes(client.name);
                            return (
                                <div
                                    key={client.name}
                                    onClick={() => onToggleClient(client.name)}
                                    className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`text-gray-400 ${isSelected ? 'text-blue-600' : ''}`}>
                                            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </div>
                                        <span className={`text-sm truncate ${isSelected ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                                            {client.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                        {formatCurrency(client.ca_total)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-400 text-center">
                {filteredClients.length} clients affichés
            </div>
        </div>
    );
};
