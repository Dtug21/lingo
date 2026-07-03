import type {
  Exercise,
  FillBlankExercise,
  Lesson,
  ListenChooseExercise,
  MatchPairsExercise,
  MultipleChoiceExercise,
  SpeakExercise,
  TranslateDirection,
  TranslateExercise,
  WordOrderExercise,
} from '../types';

/** Omit distributivo para uniones discriminadas. */
type DistributiveOmit<T, K extends keyof Exercise> = T extends unknown ? Omit<T, K> : never;
export type ExerciseDraft = DistributiveOmit<Exercise, 'id'>;

export function mc(
  question: string,
  options: string[],
  correctIndex: number,
): Omit<MultipleChoiceExercise, 'id'> {
  return { type: 'multiple-choice', question, options, correctIndex };
}

export function fill(
  sentence: string,
  options: string[],
  correctIndex: number,
): Omit<FillBlankExercise, 'id'> {
  return { type: 'fill-blank', sentence, options, correctIndex };
}

export function translate(
  text: string,
  direction: TranslateDirection,
  accepted: string[],
): Omit<TranslateExercise, 'id'> {
  return { type: 'translate', text, direction, accepted };
}

export function match(pairs: Array<[english: string, spanish: string]>): Omit<MatchPairsExercise, 'id'> {
  return { type: 'match-pairs', pairs: pairs.map(([left, right]) => ({ left, right })) };
}

/** `words` se deriva de la oración correcta + distractores; el componente las baraja al montar. */
export function order(
  prompt: string,
  correct: string,
  distractors: string[] = [],
): Omit<WordOrderExercise, 'id'> {
  return { type: 'word-order', prompt, correct, words: [...correct.split(' '), ...distractors] };
}

export function listen(
  ttsText: string,
  options: string[],
  correctIndex: number,
): Omit<ListenChooseExercise, 'id'> {
  return { type: 'listen-choose', ttsText, options, correctIndex };
}

export function speak(text: string, translation: string): Omit<SpeakExercise, 'id'> {
  return { type: 'speak', text, translation };
}

/** Compone una lección asignando ids estables a cada ejercicio. */
export function lesson(id: string, title: string, drafts: ExerciseDraft[]): Lesson {
  return {
    id,
    title,
    exercises: drafts.map((d, i) => ({ ...d, id: `${id}-e${i + 1}` }) as Exercise),
  };
}
