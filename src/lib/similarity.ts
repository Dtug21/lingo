import { normalizeAnswer } from './validation';

/**
 * Proporción [0,1] de palabras de la frase objetivo presentes en la
 * transcripción del usuario. Métrica simple y tolerante para evaluar
 * pronunciación con reconocimiento de voz.
 */
export function wordMatchRatio(target: string, transcript: string): number {
  const targetWords = normalizeAnswer(target).split(' ').filter(Boolean);
  if (targetWords.length === 0) return 0;
  const spoken = new Set(normalizeAnswer(transcript).split(' ').filter(Boolean));
  const matched = targetWords.filter((w) => spoken.has(w)).length;
  return matched / targetWords.length;
}

/** Umbral de acierto para ejercicios de pronunciación. */
export const SPEAK_PASS_RATIO = 0.6;

export function isSpeechAccepted(target: string, transcript: string): boolean {
  return wordMatchRatio(target, transcript) >= SPEAK_PASS_RATIO;
}
