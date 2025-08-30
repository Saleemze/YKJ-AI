import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
    selectedRatio: AspectRatio;
    onRatioChange: (ratio: AspectRatio) => void;
    disabled: boolean;
}

const RATIOS: { value: AspectRatio; label: string }[] = [
    { value: '16:9', label: 'Landscape' },
    { value: '1:1', label: 'Square' },
    { value: '9:16', label: 'Portrait' },
];

const AspectRatioIcon: React.FC<{ ratio: AspectRatio }> = ({ ratio }) => {
    const dimensions = {
        '16:9': { width: 16, height: 9 },
        '1:1': { width: 12, height: 12 },
        '9:16': { width: 9, height: 16 },
    };
    const d = dimensions[ratio];
    return (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect 
                x={(20 - d.width) / 2} 
                y={(20 - d.height) / 2} 
                width={d.width} 
                height={d.height} 
                rx="1" 
                className="stroke-current"
                strokeWidth="1.5"
            />
        </svg>
    );
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, disabled }) => {
    return (
        <div className="animate-fade-in" role="radiogroup" aria-labelledby="aspect-ratio-label">
            <label id="aspect-ratio-label" className="block text-sm font-medium text-slate-400 mb-2">Aspect Ratio</label>
            <div className={`grid grid-cols-3 gap-2 rounded-lg bg-slate-700 p-1 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {RATIOS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => onRatioChange(value)}
                        disabled={disabled}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 w-full py-2 px-3 text-center font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700 focus-visible:ring-purple-500 ${
                            selectedRatio === value
                                ? 'bg-purple-600 text-white shadow'
                                : 'text-slate-300 hover:bg-slate-600/50'
                        }`}
                        role="radio"
                        aria-checked={selectedRatio === value}
                    >
                        <AspectRatioIcon ratio={value} />
                        <span className="text-sm hidden sm:inline">{label}</span>
                        <span className="text-xs sm:text-sm">({value})</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;