import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
    startDate: string | null;
    endDate: string | null;
    onChange: (start: string | null, end: string | null) => void;
}

const PRESETS = [
    { label: "7 jours", days: 7 },
    { label: "30 jours", days: 30 },
    { label: "90 jours", days: 90 },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {

    const applyPreset = (days: number) => {
        const end = new Date();
        const start = new Date();

        if (days === -1) {
            // Cette année (depuis 1er Janv)
            start.setMonth(0, 1);
        } else if (days === 0) {
            // Tout
            onChange(null, null);
            return;
        } else {
            // X derniers jours
            start.setDate(end.getDate() - days);
        }

        onChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} />
                Période
            </h3>

            <div className="flex flex-wrap gap-2">
                {PRESETS.map(preset => (
                    <button
                        key={preset.label}
                        onClick={() => applyPreset(preset.days)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                    >
                        {preset.label}
                    </button>
                ))}
                <button
                    onClick={() => applyPreset(-1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                    Cette année
                </button>
                <button
                    onClick={() => applyPreset(0)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors border border-gray-300"
                >
                    Tout
                </button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Date de début</label>
                    <input
                        type="date"
                        value={startDate || ''}
                        onChange={(e) => onChange(e.target.value || null, endDate)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <span className="text-gray-400 mt-5">→</span>
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Date de fin</label>
                    <input
                        type="date"
                        value={endDate || ''}
                        onChange={(e) => onChange(startDate, e.target.value || null)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};
