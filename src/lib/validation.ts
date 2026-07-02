/**
 * Normaliza una respuesta libre para compararla con tolerancia:
 * minúsculas, sin tildes/diacríticos, sin puntuación y con espacios colapsados.
 */
export function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.,;:!?¡¿'"()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAnswerAccepted(input: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(input);
  if (normalized.length === 0) return false;
  return accepted.some((a) => normalizeAnswer(a) === normalized);
}

/** Compara una oración armada palabra a palabra (word-order). */
export function isSentenceCorrect(built: string[], correct: string): boolean {
  return normalizeAnswer(built.join(' ')) === normalizeAnswer(correct);
}
