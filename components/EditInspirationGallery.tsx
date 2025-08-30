import React from 'react';
import { EDIT_TEMPLATES } from '../constants';

interface EditInspirationGalleryProps {
  onSelectPrompt: (prompt: string) => void;
}

const EditInspirationGallery: React.FC<EditInspirationGalleryProps> = ({ onSelectPrompt }) => {
  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">Editing Ideas</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
        {EDIT_TEMPLATES.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group relative flex-shrink-0 w-32 h-48 bg-slate-700 rounded-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-purple-500 transition-transform duration-300 ease-in-out hover:scale-105"
            aria-label={`Use prompt: ${item.prompt}`}
          >
            <div className="flex w-full h-full">
              <img 
                src={item.beforeUrl} 
                alt="Before" 
                className="w-1/2 h-full object-cover"
              />
              <img 
                src={item.afterUrl} 
                alt="After" 
                className="w-1/2 h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white p-1 bg-black/20 rounded">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditInspirationGallery;