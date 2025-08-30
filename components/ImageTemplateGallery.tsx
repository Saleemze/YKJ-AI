import React from 'react';
import { IMAGE_TEMPLATES_9_16 } from '../constants';

interface ImageTemplateGalleryProps {
  onSelectPrompt: (prompt: string) => void;
}

const ImageTemplateGallery: React.FC<ImageTemplateGalleryProps> = ({ onSelectPrompt }) => {
  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">Templates (9:16)</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
        {IMAGE_TEMPLATES_9_16.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group relative flex-shrink-0 w-32 h-48 bg-slate-700 rounded-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-purple-500 transition-transform duration-300 ease-in-out hover:scale-105"
            aria-label={`Use prompt: ${item.prompt}`}
          >
            <img 
              src={item.thumbnailUrl} 
              alt={item.prompt} 
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/30 backdrop-blur-sm rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white p-1">
              {item.prompt.substring(0, 50)}{item.prompt.length > 50 ? '...' : ''}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageTemplateGallery;