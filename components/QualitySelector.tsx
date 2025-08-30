import React from 'react';
import { Quality } from '../types';
import { QUALITIES } from '../constants';

interface QualitySelectorProps {
    selectedQuality: Quality;
    onQualityChange: (quality: Quality) => void;
    disabled: boolean;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ selectedQuality, onQualityChange, disabled }) => {
    return (
        <div className="animate-fade-in" role="radiogroup" aria-labelledby="quality-label">
            <label id="quality-label" className="block text-sm font-medium text-slate-400 mb-2">Quality</label>
            <div className={`grid grid-cols-2 gap-2 rounded-lg bg-slate-700 p-1 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {QUALITIES.map((quality) => (
                    <button
                        key={quality}
                        onClick={() => onQualityChange(quality as Quality)}
                        disabled={disabled}
                        className={`w-full py-2 px-3 text-center font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700 focus-visible:ring-purple-500 text-sm ${
                            selectedQuality === quality
                                ? 'bg-purple-600 text-white shadow'
                                : 'text-slate-300 hover:bg-slate-600/50'
                        }`}
                        role="radio"
                        aria-checked={selectedQuality === quality}
                    >
                        {quality}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QualitySelector;
