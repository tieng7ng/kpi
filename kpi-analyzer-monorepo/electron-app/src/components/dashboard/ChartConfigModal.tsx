import React, { useState, useEffect } from 'react';
import type { ChartConfig, ChartType } from '../../types/dashboard';
import { X } from 'lucide-react';
import { generateUUID } from '../../utils/uuid';

interface ChartConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: ChartConfig) => void;
    availableIndicators: string[];
    availableCategories: string[];
    initialConfig?: ChartConfig | null;
}

export const ChartConfigModal: React.FC<ChartConfigModalProps> = ({ isOpen, onClose, onSave, availableIndicators, availableCategories, initialConfig }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<ChartType>('line');

    // Nouvelle logique de sélection
    const [selectedIndicator, setSelectedIndicator] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [period, setPeriod] = useState<ChartConfig['period']>('30d');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Reset du formulaire
    useEffect(() => {
        if (isOpen) {
            if (initialConfig) {
                // Mode Édition
                setTitle(initialConfig.title);
                setType(initialConfig.type);
                setSelectedIndicator(initialConfig.indicator || '');
                setSelectedCategories(initialConfig.categories || []);
                setPeriod(initialConfig.period);
                setStartDate(initialConfig.startDate || '');
                setEndDate(initialConfig.endDate || '');
            } else {
                // Mode Création (défauts)
                setTitle('');
                setType('line');
                // Par défaut, premier indicateur et toutes les catégories (ou aucune ?)
                setSelectedIndicator(availableIndicators.length > 0 ? availableIndicators[0] : '');
                setSelectedCategories(availableCategories); // Tout sélectionner par défaut
                setPeriod('30d');
                setStartDate('');
                setEndDate('');
            }
        }
    }, [isOpen, initialConfig, availableIndicators, availableCategories]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialConfig ? initialConfig.id : generateUUID(),
            title: title || 'Nouveau Graphique',
            type,
            indicator: selectedIndicator,
            categories: selectedCategories,
            period,
            startDate: period === 'custom' ? startDate : undefined,
            endDate: period === 'custom' ? endDate : undefined,
            color: '#8884d8' // Couleur par défaut
        });
        onClose();
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const selectAllCategories = () => {
        if (selectedCategories.length === availableCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(availableCategories);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialConfig ? 'Modifier le Graphique' : 'Nouveau Graphique'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 1. Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ex: Revenus Q1"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    {/* 2. Type de Graphique */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['line', 'bar', 'area', 'pie'] as ChartType[]).map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`px-2 py-2 rounded-lg border text-sm capitalize transition-colors ${type === t
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Période */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value as any)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="7d">7 derniers jours</option>
                            <option value="30d">30 derniers jours</option>
                            <option value="90d">90 derniers jours</option>
                            <option value="year">Cette année</option>
                            <option value="custom">Personnalisée</option>
                        </select>

                        {period === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Début</label>
                                    <input
                                        type="date"
                                        required={period === 'custom'}
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Fin</label>
                                    <input
                                        type="date"
                                        required={period === 'custom'}
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Sélection Indicateur (Unique) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Indicateur</label>
                        <select
                            value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            {availableIndicators.length === 0 && <option value="">Aucun indicateur</option>}
                            {availableIndicators.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>

                    {/* 5. Sélection Catégories (Multiple) */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Catégories</label>
                            <button type="button" onClick={selectAllCategories} className="text-xs text-blue-600 hover:underline">
                                {selectedCategories.length === availableCategories.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                            </button>
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                            {availableCategories.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-2">Aucune catégorie disponible</p>
                            ) : availableCategories.map(cat => (
                                <label key={cat} className="flex items-center space-x-2 p-1.5 hover:bg-white rounded cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedIndicator}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {initialConfig ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
