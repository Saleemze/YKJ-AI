// FIX: Add DOM library reference to resolve SpeechRecognition API and 'window' type errors.
/// <reference lib="dom" />

import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition API types for browsers that support it.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } }, length: number } }) => void;
  onend: () => void;
  onerror: (event: { error: any }) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface UseSpeechToTextOptions {
  onTranscript: (transcript: string) => void;
}

export const useSpeechToText = ({ onTranscript }: UseSpeechToTextOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition not supported by this browser.");
      setSpeechApiSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [onTranscript]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setRecordingTime(0);
      setIsRecording(true);
      recognitionRef.current.start();
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    speechApiSupported,
  };
};