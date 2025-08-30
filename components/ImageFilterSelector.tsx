import React from 'react';

interface ImageFilterSelectorProps {
    selectedFilter: string;
    onFilterChange: (filter: string) => void;
    disabled: boolean;
}

const FILTERS: { name: string, value: string }[] = [
    { name: 'None', value: 'none' },
    { name: 'B&W', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Vintage', value: 'sepia(60%) contrast(110%) brightness(90%)' },
    { name: 'Invert', value: 'invert(100%)' },
];

const ImageFilterSelector: React.FC<ImageFilterSelectorProps> = ({ selectedFilter, onFilterChange, disabled }) => {
    return (
        <div className="mt-6 animate-fade-in" role="radiogroup" aria-labelledby="filter-label">
            <label id="filter-label" className="block text-sm font-medium text-slate-400 mb-2">Instant Filters</label>
            <div className={`grid grid-cols-3 sm:grid-cols-5 gap-2 rounded-lg bg-slate-700 p-1 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {FILTERS.map((filter) => (
                    <button
                        key={filter.name}
                        onClick={() => onFilterChange(filter.value)}
                        disabled={disabled}
                        className={`w-full py-2 px-3 text-center text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700 focus-visible:ring-purple-500 ${
                            selectedFilter === filter.value
                                ? 'bg-purple-600 text-white shadow'
                                : 'text-slate-300 hover:bg-slate-600/50'
                        }`}
                        role="radio"
                        aria-checked={selectedFilter === filter.value}
                    >
                        {filter.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageFilterSelector;
