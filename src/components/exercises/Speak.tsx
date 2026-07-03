import { useEffect, useImperativeHandle, useState } from 'react';
import type { SpeakExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { isSpeechAccepted } from '../../lib/similarity';
import { useSpeech } from '../../hooks/useSpeech';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export function Speak({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<SpeakExercise>) {
  const { speak } = useSpeech();
  const recognition = useSpeechRecognition();
  const [skipped, setSkipped] = useState(false);

  const hasAnswer = recognition.transcript.length > 0 || skipped || !recognition.supported;

  useEffect(() => {
    onReadyChange(hasAnswer);
  }, [hasAnswer, onReadyChange]);

  useImperativeHandle(
    ref,
    () => ({
      check: () => {
        // sin soporte de micrófono (o saltado): cuenta como práctica, no penaliza
        if (!recognition.supported || skipped) return true;
        return isSpeechAccepted(exercise.text, recognition.transcript);
      },
    }),
    [recognition.supported, recognition.transcript, skipped, exercise.text],
  );

  return (
    <div className="animate-slide-up">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-extrabold text-gray-800">{exercise.text}</p>
            <p className="mt-1 text-sm font-semibold text-gray-400">{exercise.translation}</p>
          </div>
          <button
            type="button"
            onClick={() => speak(exercise.text)}
            aria-label="Escuchar la pronunciación"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-b-4 border-sky-600 bg-sky-400 text-xl text-white transition-all duration-100 hover:bg-sky-300 active:translate-y-[2px] active:border-b-0 cursor-pointer"
          >
            <span aria-hidden="true">🔊</span>
          </button>
        </div>
      </div>

      {recognition.supported ? (
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            disabled={disabled || recognition.listening}
            onClick={recognition.start}
            aria-label={recognition.listening ? 'Escuchando…' : 'Presiona y habla en inglés'}
            className={`flex h-24 w-24 items-center justify-center rounded-full border-b-8 text-4xl text-white transition-all duration-150 cursor-pointer ${
              recognition.listening
                ? 'animate-bounce-soft border-coral-700 bg-coral-500'
                : 'border-brand-700 bg-brand-500 hover:bg-brand-400 active:translate-y-[4px] active:border-b-4'
            }`}
          >
            <span aria-hidden="true">🎤</span>
          </button>
          <p className="text-sm font-bold text-gray-400" aria-live="polite">
            {recognition.listening
              ? 'Escuchando… habla ahora'
              : recognition.transcript
                ? `Te escuché decir: “${recognition.transcript}”`
                : 'Toca el micrófono y lee la frase en voz alta'}
          </p>
          {recognition.error && (
            <p className="rounded-xl bg-sunshine-100 px-4 py-2 text-sm font-semibold text-gray-600">
              {recognition.error}
            </p>
          )}
          {!skipped && !disabled && (
            <button
              type="button"
              onClick={() => setSkipped(true)}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 underline-offset-2 hover:underline cursor-pointer"
            >
              No puedo hablar ahora
            </button>
          )}
          {skipped && (
            <p className="text-xs font-semibold text-gray-400">
              Ejercicio marcado como práctica: no afecta tu puntaje.
            </p>
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-sunshine-100 p-4 text-sm font-semibold text-gray-600">
          Tu navegador no soporta reconocimiento de voz (prueba Chrome, Edge o Safari). Lee la
          frase en voz alta como práctica y continúa: no afecta tu puntaje.
        </p>
      )}
    </div>
  );
}
