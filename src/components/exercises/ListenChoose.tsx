import { useEffect, useImperativeHandle, useState } from 'react';
import type { ListenChooseExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { OptionGrid } from './OptionGrid';
import { useSpeech } from '../../hooks/useSpeech';

export function ListenChoose({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<ListenChooseExercise>) {
  const [selected, setSelected] = useState<number | null>(null);
  const { speak, supported } = useSpeech();

  // Reproduce el audio automáticamente al aparecer el ejercicio
  useEffect(() => {
    const id = window.setTimeout(() => speak(exercise.ttsText), 350);
    return () => window.clearTimeout(id);
  }, [exercise.ttsText, speak]);

  useEffect(() => {
    onReadyChange(selected !== null);
  }, [selected, onReadyChange]);

  useImperativeHandle(ref, () => ({ check: () => selected === exercise.correctIndex }), [
    selected,
    exercise.correctIndex,
  ]);

  return (
    <div className="animate-slide-up">
      <div className="mb-6 flex justify-center">
        <button
          type="button"
          onClick={() => speak(exercise.ttsText)}
          aria-label="Escuchar de nuevo"
          className="flex h-20 w-20 items-center justify-center rounded-3xl border-b-4 border-sky-600 bg-sky-400 text-4xl text-white transition-all duration-100 hover:bg-sky-300 active:translate-y-[3px] active:border-b-0 cursor-pointer"
        >
          <span aria-hidden="true">🔊</span>
        </button>
      </div>
      {!supported && (
        <p className="mb-4 rounded-xl bg-sunshine-100 p-3 text-sm font-semibold text-gray-600">
          Tu navegador no soporta síntesis de voz. La frase era: “{exercise.ttsText}”
        </p>
      )}
      <OptionGrid
        options={exercise.options}
        selected={selected}
        onSelect={setSelected}
        disabled={disabled}
      />
    </div>
  );
}
