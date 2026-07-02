import { useCallback, useMemo } from 'react';

/** Texto-a-voz con la Web Speech API (voz en-US). Sin audio real en el proyecto. */
export function useSpeech() {
  const supported = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, []);

  const speak = useCallback(
    (text: string, rate = 0.95) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      const voice = window.speechSynthesis
        .getVoices()
        .find((v) => v.lang.startsWith('en') && v.default) ??
        window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('en'));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  return { speak, supported };
}
