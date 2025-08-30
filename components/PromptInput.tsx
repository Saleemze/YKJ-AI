// FIX: Add DOM library reference to resolve 'document' and other DOM API type errors.
/// <reference lib="dom" />

import React, { forwardRef } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: React.SetStateAction<string>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  showImageUpload: boolean;
  showVideoUpload: boolean;
  imageRequired?: boolean;
  videoRequired?: boolean;
  placeholder: string;
}

const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(({
  prompt,
  onPromptChange,
  onFileChange,
  onSubmit,
  isLoading,
  showImageUpload,
  showVideoUpload,
  imageRequired = false,
  videoRequired = false,
  placeholder,
}, ref) => {
  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    speechApiSupported,
  } = useSpeechToText({
    onTranscript: (transcript) => {
      onPromptChange(currentPrompt => currentPrompt ? `${currentPrompt} ${transcript}` : transcript);
    }
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // This check needs to be more robust for multiple tabs requiring different files
  const isFileMissing = (imageRequired && !(document.getElementById('image-upload') as HTMLInputElement)?.files?.length) ||
                       (videoRequired && !(document.getElementById('video-upload') as HTMLInputElement)?.files?.length);

  const isSubmitDisabled = isLoading || !prompt.trim() || isRecording || isFileMissing;

  return (
    <div>
      <div className="relative">
        <textarea
          ref={ref}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-slate-700 border-2 border-slate-600 rounded-xl p-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 resize-none"
          disabled={isLoading}
        />
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
            {showImageUpload && (
                <label htmlFor="image-upload" className="cursor-pointer group flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-slate-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    {imageRequired ? 'Upload Image' : 'Add Image (Optional)'}
                  </span>
                </label>
            )}
            {/* We render both but only one is shown via the label */}
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={isLoading} />

            {showVideoUpload && (
                <label htmlFor="video-upload" className="cursor-pointer group flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-slate-200" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Upload Video
                  </span>
                </label>
            )}
             <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={onFileChange} disabled={isLoading} />

            {speechApiSupported && (
                 <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                      <span className="text-sm font-medium tabular-nums">{formatTime(recordingTime)}</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.445-5.921V4a5 5 0 10-8.555 5.921V8a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                       <span className="text-sm font-medium">Record Voice</span>
                    </>
                  )}
                </button>
            )}
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="w-full sm:w-auto sm:ml-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
});

export default PromptInput;