import React from 'react';

interface VideoResultProps {
  src: string;
}

const VideoResult: React.FC<VideoResultProps> = ({ src }) => (
  <div className="relative w-full h-full p-2 flex items-center justify-center">
    <video
      key={src} // Force re-mount on new src to avoid issues
      src={src}
      controls
      loop
      className="max-w-full max-h-full rounded-lg shadow-lg"
    >
      Your browser does not support the video tag.
    </video>
    {/* Watermark Overlay for Video Display */}
    <span 
        className="absolute bottom-4 right-4 text-white/70 text-sm font-bold pointer-events-none opacity-0 animate-watermark-reveal"
        style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
    >
      YKJ-Ai
    </span>
  </div>
);

export default VideoResult;