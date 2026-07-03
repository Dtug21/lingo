import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechRecognitionResult {
  supported: boolean;
  listening: boolean;
  transcript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

/** Reconocimiento de voz (en-US) con la Web Speech API. */
export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const Ctor =
    typeof window !== 'undefined'
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
      : undefined;
  const supported = Ctor !== undefined;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    if (!Ctor || listening) return;
    setError(null);
    setTranscript('');
    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onresult = (event) => {
      const alternatives: string[] = [];
      const result = event.results[0];
      for (let i = 0; i < result.length; i++) {
        alternatives.push(result[i].transcript);
      }
      // guarda todas las alternativas unidas: la comparación es por palabras
      setTranscript(alternatives.join(' '));
    };
    recognition.onerror = (event) => {
      setError(
        event.error === 'not-allowed'
          ? 'Permite el acceso al micrófono para practicar pronunciación.'
          : 'No se pudo escuchar. Intenta de nuevo.',
      );
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [Ctor, listening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { supported, listening, transcript, error, start, stop };
}
