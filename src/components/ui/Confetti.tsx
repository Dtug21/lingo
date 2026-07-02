import { useMemo } from 'react';

const COLORS = ['#22c55e', '#ffc800', '#ff4b6e', '#38bdf8', '#a78bfa', '#fb923c'];
const PIECES = 60;

/** Confetti CSS sin dependencias: piezas que caen una sola vez al montar. */
export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        round: Math.random() > 0.5,
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 0.5),
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
