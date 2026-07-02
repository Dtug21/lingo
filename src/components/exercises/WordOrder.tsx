import { useEffect, useImperativeHandle, useState } from 'react';
import type { WordOrderExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { isSentenceCorrect } from '../../lib/validation';
import { shuffle } from '../../lib/shuffle';

interface Token {
  key: number;
  word: string;
}

export function WordOrder({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<WordOrderExercise>) {
  const [bank, setBank] = useState<Token[]>(() =>
    shuffle(exercise.words.map((word, key) => ({ key, word }))),
  );
  const [picked, setPicked] = useState<Token[]>([]);

  useEffect(() => {
    onReadyChange(picked.length > 0);
  }, [picked.length, onReadyChange]);

  useImperativeHandle(
    ref,
    () => ({
      check: () =>
        isSentenceCorrect(
          picked.map((t) => t.word),
          exercise.correct,
        ),
    }),
    [picked, exercise.correct],
  );

  const pick = (token: Token) => {
    setBank((b) => b.filter((t) => t.key !== token.key));
    setPicked((p) => [...p, token]);
  };

  const unpick = (token: Token) => {
    setPicked((p) => p.filter((t) => t.key !== token.key));
    setBank((b) => [...b, token]);
  };

  const chip =
    'rounded-xl border-2 border-b-4 border-gray-200 bg-white px-3 py-2 text-base font-bold text-gray-700 transition-all duration-100 hover:bg-gray-50 active:translate-y-[2px] active:border-b-2 cursor-pointer disabled:cursor-default';

  return (
    <div className="animate-slide-up">
      <p className="mb-6 rounded-2xl bg-white p-5 text-2xl font-extrabold text-gray-800 shadow-sm">
        {exercise.prompt}
      </p>

      <div
        aria-label="Tu oración"
        className="mb-6 flex min-h-16 flex-wrap items-start gap-2 border-b-2 border-dashed border-gray-300 pb-3"
      >
        {picked.length === 0 && (
          <span className="text-base font-semibold text-gray-300">
            Toca las palabras en orden…
          </span>
        )}
        {picked.map((token) => (
          <button
            key={token.key}
            type="button"
            disabled={disabled}
            onClick={() => unpick(token)}
            aria-label={`Quitar "${token.word}" de la oración`}
            className={`${chip} animate-pop`}
          >
            {token.word}
          </button>
        ))}
      </div>

      <div aria-label="Palabras disponibles" className="flex flex-wrap justify-center gap-2">
        {bank.map((token) => (
          <button
            key={token.key}
            type="button"
            disabled={disabled}
            onClick={() => pick(token)}
            aria-label={`Agregar "${token.word}" a la oración`}
            className={chip}
          >
            {token.word}
          </button>
        ))}
      </div>
    </div>
  );
}
