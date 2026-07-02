import { useEffect, useImperativeHandle, useState } from 'react';
import type { FillBlankExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { OptionGrid } from './OptionGrid';

export function FillBlank({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<FillBlankExercise>) {
  const [selected, setSelected] = useState<number | null>(null);
  const [before, after] = exercise.sentence.split('___');

  useEffect(() => {
    onReadyChange(selected !== null);
  }, [selected, onReadyChange]);

  useImperativeHandle(ref, () => ({ check: () => selected === exercise.correctIndex }), [
    selected,
    exercise.correctIndex,
  ]);

  return (
    <div className="animate-slide-up">
      <p className="mb-6 rounded-2xl bg-white p-5 text-xl font-bold leading-relaxed text-gray-800 shadow-sm">
        {before}
        <span
          className={`mx-1 inline-block min-w-20 rounded-lg border-b-4 px-2 text-center ${
            selected !== null
              ? 'border-brand-400 bg-brand-50 text-brand-700'
              : 'border-gray-300 text-transparent'
          }`}
        >
          {selected !== null ? exercise.options[selected] : '____'}
        </span>
        {after}
      </p>
      <OptionGrid
        options={exercise.options}
        selected={selected}
        onSelect={setSelected}
        disabled={disabled}
      />
    </div>
  );
}
