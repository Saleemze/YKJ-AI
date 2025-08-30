// FIX: Add DOM library reference to resolve HTMLAudioElement and other DOM API type errors.
/// <reference lib="dom" />

import React, { useRef, useState, useEffect } from 'react';
import { MusicTrack } from '../types';
import { MUSIC_TRACKS } from '../constants';

interface MusicSelectorProps {
    selectedTrackUrl: string;
    onTrackChange: (url: string) => void;
    disabled: boolean;
}

const MusicSelector: React.FC<MusicSelectorProps> = ({ selectedTrackUrl, onTrackChange, disabled }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [previewingUrl, setPreviewingUrl] = useState<string | null>(null);

    const handlePreview = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        if (previewingUrl === url) {
            audioRef.current?.pause();
            setPreviewingUrl(null);
        } else if (url) {
            setPreviewingUrl(url);
        }
    };
    
    useEffect(() => {
        const audioEl = audioRef.current;
        if (previewingUrl && audioEl) {
            audioEl.src = previewingUrl;
            audioEl.play().catch(console.error);
        }
        return () => {
            audioEl?.pause();
        }
    }, [previewingUrl]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Stop any currently playing preview when a new track is selected
        if (previewingUrl) {
            setPreviewingUrl(null);
        }
        onTrackChange(e.target.value);
    };

    return (
        <div className="animate-fade-in">
            <audio ref={audioRef} onEnded={() => setPreviewingUrl(null)} className="hidden" />
            <label htmlFor="music-select" className="block text-sm font-medium text-slate-400 mb-2">Background Music</label>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
                <div className="relative flex-grow w-full">
                    <select
                        id="music-select"
                        value={selectedTrackUrl}
                        onChange={handleSelectChange}
                        disabled={disabled}
                        className={`w-full appearance-none bg-slate-700 border border-slate-600 rounded-lg py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {MUSIC_TRACKS.map(track => (
                            <option key={track.name} value={track.url}>{track.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
                 <div className="flex flex-wrap gap-2 items-center">
                    {MUSIC_TRACKS.filter(t => t.url && t.url === selectedTrackUrl).map(track => (
                        <button 
                            key={`preview-${track.name}`}
                            onClick={(e) => handlePreview(e, track.url)}
                            disabled={disabled || !track.url}
                            className="flex items-center gap-1.5 text-sm px-3 py-2 bg-slate-600/50 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 disabled:opacity-50"
                            aria-label={`Preview ${track.name}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                {previewingUrl === track.url ? (
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H8z" clipRule="evenodd" />
                                ) : (
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                )}
                            </svg>
                            <span>Preview</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MusicSelector;