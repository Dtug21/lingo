import { useEffect, useImperativeHandle, useState } from 'react';
import type { TranslateExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { isAnswerAccepted } from '../../lib/validation';

export function Translate({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<TranslateExercise>) {
  const [value, setValue] = useState('');

  useEffect(() => {
    onReadyChange(value.trim().length > 0);
  }, [value, onReadyChange]);

  useImperativeHandle(ref, () => ({ check: () => isAnswerAccepted(value, exercise.accepted) }), [
    value,
    exercise.accepted,
  ]);

  const targetLang = exercise.direction === 'en-es' ? 'español' : 'inglés';

  return (
    <div className="animate-slide-up">
      <p className="mb-6 rounded-2xl bg-white p-5 text-2xl font-extrabold text-gray-800 shadow-sm">
        {exercise.text}
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        rows={3}
        autoFocus
        aria-label={`Escribe la traducción en ${targetLang}`}
        placeholder={`Escribe en ${targetLang}…`}
        className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white p-4 text-lg font-semibold text-gray-800 placeholder:text-gray-300 focus:border-brand-400 focus:outline-none disabled:bg-gray-50"
      />
    </div>
  );
}
