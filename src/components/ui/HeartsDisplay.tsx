import { useEffect, useRef, useState } from 'react';
import { MAX_HEARTS } from '../../lib/hearts';

interface HeartsDisplayProps {
  count: number;
  compact?: boolean;
}

/** Corazones con animación de "corazón roto" cuando baja el contador. */
export function HeartsDisplay({ count, compact = false }: HeartsDisplayProps) {
  const prev = useRef(count);
  const [losing, setLosing] = useState(false);

  useEffect(() => {
    if (count < prev.current) {
      setLosing(true);
      const id = window.setTimeout(() => setLosing(false), 600);
      return () => window.clearTimeout(id);
    }
    prev.current = count;
  }, [count]);

  useEffect(() => {
    prev.current = count;
  }, [count]);

  if (compact) {
    return (
      <span
        className="flex items-center gap-1 font-extrabold text-coral-500"
        aria-label={`${count} de ${MAX_HEARTS} vidas`}
      >
        <span aria-hidden="true">❤️</span>
        {count}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1" aria-label={`${count} de ${MAX_HEARTS} vidas`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => {
        const isBreaking = losing && i === count;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`text-xl ${isBreaking ? 'animate-heart-break' : ''} ${
              i < count ? '' : 'opacity-25 grayscale'
            }`}
          >
            {isBreaking ? '💔' : '❤️'}
          </span>
        );
      })}
    </div>
  );
}
