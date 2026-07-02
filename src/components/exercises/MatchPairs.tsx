import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { MatchPairsExercise } from '../../types';
import type { ExerciseComponentProps } from './shared';
import { shuffle } from '../../lib/shuffle';

type Side = 'left' | 'right';

interface CardState {
  word: string;
  side: Side;
  /** Índice del par al que pertenece, para validar el match. */
  pairIndex: number;
}

export function MatchPairs({
  exercise,
  disabled,
  onReadyChange,
  ref,
}: ExerciseComponentProps<MatchPairsExercise>) {
  const [leftCards] = useState<CardState[]>(() =>
    shuffle(exercise.pairs.map((p, i) => ({ word: p.left, side: 'left' as const, pairIndex: i }))),
  );
  const [rightCards] = useState<CardState[]>(() =>
    shuffle(exercise.pairs.map((p, i) => ({ word: p.right, side: 'right' as const, pairIndex: i }))),
  );
  const [selected, setSelected] = useState<CardState | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [shakeKey, setShakeKey] = useState<string | null>(null);
  const mistakes = useRef(0);

  const allMatched = matched.size === exercise.pairs.length;

  useEffect(() => {
    onReadyChange(allMatched);
  }, [allMatched, onReadyChange]);

  useImperativeHandle(ref, () => ({ check: () => mistakes.current === 0 }), []);

  const handleTap = (card: CardState) => {
    if (matched.has(card.pairIndex) && selected === null) return;
    if (selected === null) {
      setSelected(card);
      return;
    }
    if (selected.side === card.side) {
      setSelected(card.word === selected.word ? null : card);
      return;
    }
    if (selected.pairIndex === card.pairIndex) {
      setMatched((m) => new Set(m).add(card.pairIndex));
    } else {
      mistakes.current += 1;
      setShakeKey(`${card.side}-${card.word}`);
      window.setTimeout(() => setShakeKey(null), 450);
    }
    setSelected(null);
  };

  const renderColumn = (cards: CardState[], label: string) => (
    <div className="flex flex-1 flex-col gap-2" aria-label={label}>
      {cards.map((card) => {
        const isMatched = matched.has(card.pairIndex);
        const isSelected = selected?.side === card.side && selected.word === card.word;
        const isShaking = shakeKey === `${card.side}-${card.word}`;
        return (
          <button
            key={card.word}
            type="button"
            disabled={disabled || isMatched}
            aria-pressed={isSelected}
            onClick={() => handleTap(card)}
            className={`rounded-xl border-2 border-b-4 px-3 py-3 text-sm font-bold transition-all duration-150 cursor-pointer disabled:cursor-default ${
              isShaking ? 'animate-shake border-coral-400 bg-coral-100 text-coral-600' : ''
            } ${
              isMatched
                ? 'border-brand-200 bg-brand-50 text-brand-400 opacity-60'
                : isSelected
                  ? 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {card.word}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="animate-slide-up">
      <div className="flex gap-3">
        {renderColumn(leftCards, 'Palabras en inglés')}
        {renderColumn(rightCards, 'Palabras en español')}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-gray-400" aria-live="polite">
        {allMatched
          ? '¡Todo emparejado!'
          : `${matched.size} de ${exercise.pairs.length} parejas encontradas`}
      </p>
    </div>
  );
}
