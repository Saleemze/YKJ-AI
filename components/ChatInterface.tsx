// FIX: Add DOM library reference to resolve various DOM API type errors.
/// <reference lib="dom" />

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface ChatInterfaceProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  attachmentPreview: string | null;
  onFileChange: (file: File | null) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, isLoading, onSendMessage, attachmentPreview, onFileChange }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    speechApiSupported,
  } = useSpeechToText({
    onTranscript: (transcript) => {
      setInput(currentInput => currentInput ? `${currentInput} ${transcript}` : transcript);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachmentPreview) && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Error on line 51: Cast event.target to HTMLInputElement to access the 'files' property.
    const file = (e.target as HTMLInputElement).files?.[0] || null;
    onFileChange(file);
    // Clear the input value so the same file can be selected again
    // FIX: Error on line 54: Cast event.target to HTMLInputElement to set the 'value' property.
    if (e.target) (e.target as HTMLInputElement).value = '';
  };
  
  const handleRemoveAttachment = () => {
    onFileChange(null);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-4 -mr-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex my-4 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl shadow ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-200 rounded-bl-none'
            }`}>
              {msg.parts.map((part, partIndex) => {
                  if (part.imageData) {
                    const imageContent = (
                      <img 
                        src={part.imageData.url} 
                        alt="User attachment" 
                        className={`rounded-lg max-w-xs ${part.text ? 'mb-2' : ''}`}
                      />
                    );
                    // If this is the only part, or if there's no text, render it directly.
                    // Otherwise, we let the text part render it below.
                    return part.text ? null : <div key={partIndex}>{imageContent}</div>;
                  }
                  if (part.text) {
                    // Using a regex to add a cursor-like effect to the last word during streaming
                    const textContent = (isLoading && index === history.length - 1 && msg.role === 'model') 
                      ? part.text.replace(/(\S*)$/, '<span class="after:content-[\'_\'] after:ml-0.5 after:animate-ping">$1</span>')
                      : part.text;
                    
                    // Check if there's an image in the same message to render together
                    const accompanyingImage = msg.parts.find(p => p.imageData);

                    return (
                      <div key={partIndex}>
                        {accompanyingImage?.imageData && (
                           <img 
                            src={accompanyingImage.imageData.url} 
                            alt="Attachment" 
                            className="rounded-lg max-w-xs mb-2"
                          />
                        )}
                        <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: textContent }} />
                      </div>
                    );
                  }
                  return null;
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 border-t border-slate-700 pt-4">
        {attachmentPreview && (
          <div className="relative self-start mb-2 ml-4 p-1 bg-slate-800 rounded-lg animate-fade-in">
            <img src={attachmentPreview} alt="Attachment preview" className="max-h-24 rounded" />
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="absolute -top-2 -right-2 z-10 h-6 w-6 bg-red-600/90 rounded-full flex items-center justify-center text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 backdrop-blur-sm transition-all"
              aria-label="Remove attachment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for ideas, or use /generate <prompt>..."
            className="w-full bg-slate-700 border-2 border-slate-600 rounded-full py-3 pl-5 pr-40 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
            disabled={isLoading || isRecording}
            aria-label="Chat message input"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <button
              type="button"
              onClick={handleAttachClick}
              disabled={isLoading || isRecording}
              className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Attach file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
              disabled={isLoading || isRecording}
            />
            {speechApiSupported && (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${isRecording ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-purple-400'}`}
                aria-label={isRecording ? 'Stop recording voice input' : 'Start recording voice input'}
              >
                {isRecording ? (
                  <span className="text-sm font-mono animate-pulse">{formatTime(recordingTime)}</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.445-5.921V4a5 5 0 10-8.555 5.921V8a7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || isRecording || (!input.trim() && !attachmentPreview)}
              className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
              aria-label="Send message"
            >
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;