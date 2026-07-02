import { useEffect, useImperativeHandle, useState } from 'react';
import type { MultipleChoiceExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { OptionGrid } from './OptionGrid';

export function MultipleChoice({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<MultipleChoiceExercise>) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    onReadyChange(selected !== null);
  }, [selected, onReadyChange]);

  useImperativeHandle(ref, () => ({ check: () => selected === exercise.correctIndex }), [
    selected,
    exercise.correctIndex,
  ]);

  return (
    <div className="animate-slide-up">
      <h2 className="mb-6 text-xl font-extrabold text-gray-800">{exercise.question}</h2>
      <OptionGrid
        options={exercise.options}
        selected={selected}
        onSelect={setSelected}
        disabled={disabled}
      />
    </div>
  );
}
