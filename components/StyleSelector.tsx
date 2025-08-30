import React from 'react';
import { IMAGE_STYLES } from '../constants';

interface StyleSelectorProps {
    selectedStyle: string;
    onStyleChange: (style: string) => void;
    disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, disabled }) => {
    return (
        <div className="animate-fade-in" role="radiogroup" aria-labelledby="style-label">
            <label id="style-label" className="block text-sm font-medium text-slate-400 mb-2">Artistic Style</label>
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-slate-700 p-1 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {IMAGE_STYLES.map((style) => (
                    <button
                        key={style}
                        onClick={() => onStyleChange(style)}
                        disabled={disabled}
                        className={`w-full py-2 px-3 text-center text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700 focus-visible:ring-purple-500 ${
                            selectedStyle === style
                                ? 'bg-purple-600 text-white shadow'
                                : 'text-slate-300 hover:bg-slate-600/50'
                        }`}
                        role="radio"
                        aria-checked={selectedStyle === style}
                    >
                        {style}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StyleSelector;