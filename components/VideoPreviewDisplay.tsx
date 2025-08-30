import React from 'react';

interface VideoPreviewDisplayProps {
  src: string;
  onClear: () => void;
}

const VideoPreviewDisplay: React.FC<VideoPreviewDisplayProps> = ({ src, onClear }) => (
  <div className="relative w-full h-full p-2 flex items-center justify-center animate-reveal">
    <video
      key={src}
      src={src}
      controls
      autoPlay
      loop
      className="max-w-full max-h-full rounded-lg shadow-lg"
    >
      Your browser does not support the video tag.
    </video>
    <button
      onClick={onClear}
      className="absolute top-4 right-4 z-10 h-8 w-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-red-600/80 focus:outline-none focus:ring-2 focus:ring-red-400 backdrop-blur-sm transition-all"
      aria-label="Remove video"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export default VideoPreviewDisplay;
